import ScaleTool from "@/components/ScaleTool";
import { useEventListener, useMount, useUnmount } from "ahooks";
import Konva from "konva";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { calcMaxScale, calcPosition, innerWtihOuterBoxRatio } from "./util";

import { debounce } from "lodash";
import PubSub from "pubsub-js";
import URLImage from "./elements/image";

let pubToken: string;

type IProps = {
  boardSize: { width: number; height: number };
  setBoardSize: (t: { width: number; height: number }) => void;
  elements: any;
  setElements: (t: any) => void;
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
  const { boardSize, elements, setElements } = props;

  // 舞台尺寸
  const [stageSize, setStagesize] = useState({ width: 0, height: 0 });

  // 画板比例
  const [scale, setScale] = useState(initScale);
  const [clip, setClip] = useState({ x: 0, y: 0 });

  const StageWrapRef = useRef<HTMLDivElement>();
  const stageRef = useRef<Konva.Stage>();

  const calcStageSize = useCallback(() => {
    const { clientWidth: width, clientHeight: height } =
      StageWrapRef.current as HTMLDivElement;
    const { scale, clip } = calcSize({ width, height }, boardSize);
    setScale(scale);
    setClip(clip);
    setStagesize({ width, height });
    
    setElements((pre:any[])=>{
      return pre.map(i=>{
        const newItem={...i};
        newItem.attrs= {
          ...i.attrs,
          x:
          clip.x +
          boardSize.width * scale.x * newItem.ratio.x,
          y:
          clip.y +
          boardSize.height * scale.y * newItem.ratio.y,
        }
        return newItem;
      })
    })
  }, [boardSize]);

  useEventListener("resize", debounce(calcStageSize, 50));

  useMount(calcStageSize);

  useMount(() => {
    pubToken = PubSub.subscribe("sideToggle", () => {
      calcStageSize();
    });
  });

  const onDragEnd = (data: any) => {
    console.log(data);
  };

  useUnmount(() => {
    PubSub.unsubscribe(pubToken);
  });

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
    setElements((pre:any[])=>{
      return pre.map(i=>{
        const newItem={...i};
        newItem.attrs= {
          ...i.attrs,
          x:
          clip.x +
          boardSize.width * newScale * newItem.ratio.x,
          y:
          clip.y +
          boardSize.height * newScale * newItem.ratio.y,
        }
        return newItem;
      })
    })
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
      const stage = stageRef.current as Konva.Stage;
      stage.setPointersPositions(e);
      const position = stage.getPointerPosition();

      let TransData = e.dataTransfer?.getData("text/plain");

      const { type, data } = JSON.parse(TransData);

      const getRatio = () => {
        return innerWtihOuterBoxRatio(
          position?.x,
          position?.y,
          clip.x,
          clip.y,
          boardSize.width * scale.x,
          boardSize.height * scale.y
        );
      };

      switch (type) {
        case "image":
          setElements((p: any) => {
            return [
              ...p,
              {
                attrs: {
                  ...data,
                  ...position,
                },
                ratio: getRatio()
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
    return elements.map((item: any, i: number) => {
      return (
        <URLImage
          scale={{
            x: scale.x,
            y: scale.y,
          }}
          {...item}
          onChange={(newAttrs: any) => {
            const rects = elements.slice();
            rects[i].attrs = { ...rects[i].attrs, ...newAttrs };
            setElements(rects);
          }}
        />
      );
    });
  };

  return (
    <div className="bg-secondary relative  w-full h-full flex-1">
      <div
        className={`absolute  top-0  left-0  w-full h-full  overflow-auto`}
        ref={StageWrapRef as React.LegacyRef<HTMLDivElement>}
      >
        <Stage
          ref={stageRef as React.LegacyRef<Konva.Stage>}
          // onMouseDown={handleMouseDown}
          // onMousemove={handleMouseMove}
          // onMouseup={handleMouseUp}
          // onMouseOver={handleMouseOver}
          // onMouseOut={handleMouseOut}
          // onClick={handleClick}
          width={stageSize.width}
          height={stageSize.height}
          className="stageClass"
          onDragEnd={onDragEnd}
          
        >
          <Layer
            // ref={layerRef as React.LegacyRef<Konva.Layer>}
            clipHeight={boardSize.height * scale.y}
            clipWidth={boardSize.width * scale.x}
            clipX={clip.x}
            clipY={clip.y}
            
          >
            <Rect
              // ref={boardRef as React.LegacyRef<Konva.Rect>}
              x={clip.x}
              y={clip.y}
              width={boardSize.width}
              height={boardSize.height}
              fill={"white"}
              stroke="#E0E2E6" // border color
              name="background"
              scale={{
                x: scale.x,
                y: scale.y,
              }}
            />
            {renderElements()}
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
