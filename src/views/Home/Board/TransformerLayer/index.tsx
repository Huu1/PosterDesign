import * as React from "react";
import Konva from "konva";
import { Transformer } from "react-konva";

const Index = (props: any) => {
  const { trRef, currentElementProps } = props;

  return (
    <Transformer
      ref={trRef as React.LegacyRef<Konva.Transformer>}
      id="maskLayerTransform"
      keepRatio={true}
      borderStrokeWidth={2}
      rotateEnabled={currentElementProps?.draggable ? true : false}
      visible={currentElementProps?.visible ? true : false}
      enabledAnchors={
        currentElementProps?.draggable
          ? [
              "top-left",
              "top-center",
              "top-right",
              "middle-right",
              "middle-left",
              "bottom-left",
              "bottom-center",
              "bottom-right",
            ]
          : []
      }
      boundBoxFunc={(oldBox, newBox) => {
        // limit resize
        if (newBox.width < 10 || newBox.height < 10) {
          return oldBox;
        }
        return newBox;
      }}
    />
  );
};

export default Index;
