import Konva from "konva";
import React, { useEffect, useRef, useState } from "react";

import { Image, Transformer } from "react-konva";
import useImage from "use-image";
import Loading from "@/components/Loading";

function getCrop(
  image: any,
  size: { width: number; height: number },
  clipPosition = "left-top"
) {
  const width = size.width;
  const height = size.height;
  const aspectRatio = width / height;

  let newWidth;
  let newHeight;

  const imageRatio = image.width / image.height;

  if (aspectRatio >= imageRatio) {
    newWidth = image.width;
    newHeight = image.width / aspectRatio;
  } else {
    newWidth = image.height * aspectRatio;
    newHeight = image.height;
  }

  let x = 0;
  let y = 0;
  if (clipPosition === "left-top") {
    x = 0;
    y = 0;
  }

  return {
    cropX: x,
    cropY: y,
    cropWidth: newWidth,
    cropHeight: newHeight,
  };
}

const URLImage = (props: any) => {
  const { shapeProps, onChange, scale, onSelect } = props;
  const shapeRef = useRef<Konva.Image>();
  const boardRef = useRef<Konva.Transformer>();

  const [img, status] = useImage(shapeProps.url, "anonymous");

  const [showBoard, setShowBoard] = useState(false);

  function applyCrop(pos: string | undefined) {
    const img = shapeRef.current as Konva.Image;
    img.setAttr("lastCropUsed", pos);

    const crop = getCrop(
      img.image(),
      { width: img.width(), height: img.height() },
      pos
    );

    img.setAttrs(crop);
  }

  useEffect(() => {
    if (showBoard && shapeRef.current) {
      boardRef.current!.nodes([shapeRef.current]);
      boardRef.current!.getLayer()?.batchDraw();
    }
  }, [showBoard]);

  const handleSelect = () => {
    onSelect(shapeRef.current);
    setShowBoard(false);
  };

  if (status === "loading") {
    return <Loading {...props} />;
  }

  return (
    <>
      <Image
        id={shapeProps.id}
        image={img}
        ref={shapeRef as React.LegacyRef<Konva.Image>}
        x={shapeProps.x}
        y={shapeProps.y}
        width={shapeProps.width}
        height={shapeProps.height}
        draggable={shapeProps.draggable}
        visible={shapeProps.visible}
        scale={scale}
        onClick={handleSelect}
        onTap={handleSelect}
        onMouseDown={handleSelect}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransform={() => {
          const node = shapeRef.current as Konva.Image;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * (1 + scaleX - scale.x),
            height: node.height() * (1 + scaleY - scale.y),
          });

          applyCrop(node.getAttr("lastCropUsed"));
        }}
        onMouseEnter={() => {
          if (props.selectElementId !== props.shapeProps.id) {
            setShowBoard(true);
          }
        }}
        onMouseLeave={() => {
          if (showBoard) {
            setShowBoard(false);
          }
        }}
      />
      {showBoard && (
        <Transformer
          ref={boardRef as React.LegacyRef<Konva.Transformer>}
          enabledAnchors={[]}
          rotateEnabled={false}
          borderStrokeWidth={2}
        />
      )}
    </>
  );
};

export default URLImage;
