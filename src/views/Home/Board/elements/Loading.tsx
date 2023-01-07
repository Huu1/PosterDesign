import { useEffect, useRef } from "react";
import Konva from "konva";
import { Rect, Shape } from "react-konva";

const Loading = (props: any) => {
  const { attrs, scale } = props;

  const ref = useRef<any>();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    function animate(star: any) {
      star.rotate(5);
    }
    const anim = new Konva.Animation(function (frame) {
      animate(ref.current);
    });
    timer = setTimeout(function () {
      anim?.start();
    });
    return () => {
      anim?.stop();
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Rect
        x={attrs.x}
        y={attrs.y}
        width={attrs.width}
        height={attrs.height}
        scale={scale}
        fill={"skyblue"}
        opacity={0.8}
        offsetX={attrs.width / 2}
        offsetY={attrs.height / 2}
      />
      <Shape
        ref={ref}
        sceneFunc={(context: any, shape) => {
          let radius = 20;
          let thickness = 2;
          let innerRadius = radius - thickness;
          let x = 0;
          let y = 0;
          context.beginPath();
          context.arc(x, y, radius, Math.PI * 1.5, Math.PI);
          context.arc(x, y, innerRadius, Math.PI, Math.PI * 1.5, true);
          context.fillStrokeShape(shape);
        }}
        stroke="#fff"
        fill="#fff"
        x={attrs.x}
        y={attrs.y}
      />
    </>
  );
};

export default Loading;
