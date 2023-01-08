import ScaleTool from "@/components/ScaleTool";
import { useEventListener } from "ahooks";
import Konva from "konva";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";
import { calcMaxScale, calcPosition, innerWtihOuterBoxRatio } from "./util";

import { debounce } from "lodash";
import PubSub from "pubsub-js";
import URLImage from "@/components/Image";
import { Node, NodeConfig } from "konva/lib/Node";
import TransformerLayer from "./TransformerLayer";

let pubToken: string;
let exportToken: string;

type IProps = {
  boardSize: { width: number; height: number };
  setBoardSize: (t: { width: number; height: number }) => void;
  elements: any;
  selectElementId: any;
  setElements: (t: any) => void;
  setSelectElementId: (t: any) => void;
};

const initScale = {
  x: 1,
  y: 1,
};

const offsetX = 40;
const offsetY = 120;

const calcSize = (
  stageSize: { height: number; width: number },
  boardSize: { height: number; width: number }
) => {
  const { height, width } = stageSize;

  const realStageSize = {
    height: height - offsetY,
    width: width - offsetX,
  };

  const scale = calcMaxScale({ ...boardSize }, realStageSize);
  const { x, y } = calcPosition(
    { height: boardSize.height * scale, width: boardSize.width * scale },
    realStageSize
  );
  return {
    scale: { x: scale, y: scale },
    clip: {
      x: x + offsetX / 2,
      y: y + offsetY / 2,
    },
  };
};

const Index = (props: IProps) => {
  const {
    boardSize,
    elements,
    setElements,
    selectElementId,
    setSelectElementId,
  } = props;

  // 舞台尺寸
  const [stageSize, setStagesize] = useState({ width: 0, height: 0 });

  // 画板比例
  const [scale, setScale] = useState(initScale);
  const [clip, setClip] = useState({ x: 0, y: 0 });

  const StageWrapRef = useRef<HTMLDivElement>();
  const stageRef = useRef<Konva.Stage>();
  const boardRef = useRef<Konva.Rect>();
  const boardLayerRef = useRef<Konva.Layer>();

  const trRef = useRef<Konva.Transformer>();
  const currentShapeRef = useRef<Konva.Node>();

  const [currentShape, setCurrentShape] = useState<Konva.Node>();

  const calcStageSize = useCallback(() => {
    const { clientWidth: width, clientHeight: height } =
      StageWrapRef.current as HTMLDivElement;
    const { scale, clip } = calcSize({ width, height }, boardSize);
    setScale(scale);
    setClip(clip);
    setStagesize({ width, height });

    setElements((pre: any[]) => {
      return pre.map((i) => {
        const newItem = { ...i };
        newItem.shapeProps = {
          ...i.shapeProps,
          x: clip.x + boardSize.width * scale.x * newItem.ratio.x,
          y: clip.y + boardSize.height * scale.y * newItem.ratio.y,
        };
        return newItem;
      });
    });
  }, [boardSize]);

  useEventListener("resize", debounce(calcStageSize, 50));

  useEffect(() => {
    calcStageSize();
  }, [calcStageSize]);

  useEffect(() => {}, []);

  useEffect(() => {
    pubToken = PubSub.subscribe("sideToggle", () => {
      calcStageSize();
    });
    return () => {
      PubSub.unsubscribe(pubToken);
    };
  }, [calcStageSize]);

  useEffect(() => {
    exportToken = PubSub.subscribe("export", () => {
      const uri = boardLayerRef.current!.toDataURL({
        x: clip.x,
        y: clip.y,
        width: boardSize.width * scale.x,
        height: boardSize.height * scale.y,
        quality: 1,
        pixelRatio: 3,
      });
      const alink = document.createElement("a");
      alink.href = uri;
      alink.download = "fileName";
      alink.click();
    });

    return () => {
      PubSub.unsubscribe(exportToken);
    };
  }, [boardSize, clip, scale]);

  const onDragEnd = (data: any) => {
    console.log(data);
  };

  const onScaleChange = (newScale: number) => {
    const { clientWidth, clientHeight } =
      StageWrapRef.current as HTMLDivElement;
    const innerWidth = boardSize.width * newScale;
    const innerHeight = boardSize.height * newScale;
    const stageSize = {
      height: Math.max(innerHeight + offsetY, clientHeight),
      width: Math.max(innerWidth + offsetY, clientWidth),
    };
    const clip = calcPosition(
      {
        height: innerHeight,
        width: innerWidth,
      },
      stageSize
    );
    setClip(clip);
    setScale({ x: newScale, y: newScale });
    setStagesize(stageSize);
    setElements((pre: any[]) => {
      return pre.map((i) => {
        const newItem = { ...i };
        newItem.shapeProps = {
          ...i.shapeProps,
          x: clip.x + boardSize.width * newScale * newItem.ratio.x,
          y: clip.y + boardSize.height * newScale * newItem.ratio.y,
        };
        return newItem;
      });
    });
  };

  const onScaleResize = () => {
    StageWrapRef.current?.classList.add("overflow-hidden");
    calcStageSize();
    StageWrapRef.current?.classList.remove("overflow-hidden");
  };

  useEffect(() => {
    const stage = stageRef.current as Konva.Stage;
    let con = stage.container();

    function dragover(e: { preventDefault: () => void }) {
      e.preventDefault(); // !important
    }

    function drop(e: any) {
      e.preventDefault();
      stageRef.current!.setPointersPositions(e);
      const position = stage.getPointerPosition();

      // 接收图片
      const { type, data } = JSON.parse(e.dataTransfer?.getData("text/plain"));

      // 计算xy偏移量 使图片中心点在鼠标上
      const newPosition = {
        x: position!.x - (data.width * scale.x) / 2,
        y: position!.y - (data.height * scale.y) / 2,
      };

      const getRatio = () => {
        return innerWtihOuterBoxRatio(
          newPosition?.x,
          newPosition?.y,
          clip.x,
          clip.y,
          boardSize.width * scale.x,
          boardSize.height * scale.y
        );
      };

      switch (type) {
        case "image":
          setElements((p: any) => {
            const id = type + "-" + Date.now();
            return [
              ...p,
              {
                shapeProps: {
                  ...data,
                  ...newPosition,
                  draggable: true,
                  visible: true,
                  id,
                  type,
                  name:type+p.length
                },
                ratio: getRatio(),
              },
            ];
          });
          break;

        default:
          break;
      }
    }

    con.addEventListener("dragover", dragover);
    con.addEventListener("drop", drop);
    return () => {
      con.removeEventListener("dragover", dragover);
      con.removeEventListener("drop", drop);
    };
  }, [boardSize, clip, scale]);

  const renderElements = () => {
    return elements?.map((item: any, i: number) => {
      return (
        <URLImage
          scale={{
            x: scale.x,
            y: scale.y,
          }}
          {...item}
          onChange={(newAttrs: any) => {
            const rects = elements.slice();
            rects[i].shapeProps = { ...rects[i].shapeProps, ...newAttrs };
            rects[i].ratio = innerWtihOuterBoxRatio(
              newAttrs.x,
              newAttrs.y,
              clip.x,
              clip.y,
              boardSize.width * scale.x,
              boardSize.height * scale.y
            );

            setElements(rects);
          }}
          onSelect={() => {
            setSelectElementId(item.shapeProps.id);
          }}
          selectElementId={selectElementId}
          key={item.shapeProps.id}
        />
      );
    });
  };

  // const getCurrentNode = () => {
  //   const node = stageRef.current?.findOne("#" + selectElementId);
  //   return node;
  // };

  useEffect(() => {
    if (selectElementId) {
      const node = stageRef.current?.findOne("#" + selectElementId);
      if (node) {
        trRef.current?.nodes([node]);
        trRef.current?.getLayer()?.batchDraw();
      }
    }
  }, [selectElementId]);

  const currentElementProps = React.useMemo(() => {
    if (selectElementId) {
      const node = elements?.find(
        (i: { shapeProps: { id: any } }) => i.shapeProps.id === selectElementId
      );
      return node?.shapeProps ?? null;
    }
    return null;
  }, [elements, selectElementId]);

  const checkDeselect = (e: { target: { getStage: () => any } }) => {
    // deselect when clicked on empty area
    const clickedOnEmpty =
      e.target === e.target.getStage() || e.target === boardRef.current;
    if (clickedOnEmpty) {
      setSelectElementId(null);
    }
  };

  return (
    <div className="bg-secondary relative  w-full h-full flex-1">
      <div
        className={`absolute  top-0  left-0  w-full h-full  overflow-auto`}
        ref={StageWrapRef as React.LegacyRef<HTMLDivElement>}
      >
        <Stage
          ref={stageRef as React.LegacyRef<Konva.Stage>}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
          // onMouseDown={handleMouseDown}
          // onMousemove={handleMouseMove}
          // onMouseup={handleMouseUp}
          // onMouseOver={handleMouseOver}
          // onMouseOut={handleMouseOut}
          // onClick={handleClick}
          width={stageSize.width}
          height={stageSize.height}
          className="stageClass"
        >
          <Layer
            ref={boardLayerRef as React.LegacyRef<Konva.Layer>}
            clipHeight={boardSize.height * scale.y}
            clipWidth={boardSize.width * scale.x}
            clipX={clip.x}
            clipY={clip.y}
          >
            <Rect
              ref={boardRef as React.LegacyRef<Konva.Rect>}
              x={clip.x}
              y={clip.y}
              width={boardSize.width}
              height={boardSize.height}
              fill={"white"}
              // stroke="#d1dadb" // border color
              // strokeWidth={5}
              // // fillAfterStrokeEnabled
              // strokeHitEnabled={true}
              // strokeScaleEnabled={false}
              name="background"
              scale={{
                x: scale.x,
                y: scale.y,
              }}
            />

            {renderElements()}
          </Layer>
          <Layer>
            {selectElementId && (
              <TransformerLayer
                trRef={trRef}
                currentElementProps={currentElementProps}
              />
            )}
          </Layer>
        </Stage>
      </div>
      <ScaleTool
        value={scale.x}
        onChange={onScaleChange}
        resize={onScaleResize}
      />
    </div>
  );
};

export default Index;
