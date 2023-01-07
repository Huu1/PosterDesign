
import React, { useEffect, useRef, useState } from "react";

import { Image, } from "react-konva";
import useImage from "use-image";
import Loading from "./Loading";

const URLImage = (props: any) => {
  const { attrs, onChange, scale } = props;

  const [img, status] = useImage(attrs.url);


  if (status === "loading") {
    return <Loading {...props} />
  }

  return (
    <Image
      image={img}
      x={attrs.x}
      y={attrs.y}
      draggable
      width={attrs.width}
      height={attrs.height}
      scale={scale}
      offsetX={attrs.width / 2}
      offsetY={attrs.height / 2}
    />
  );
};

export default URLImage;
