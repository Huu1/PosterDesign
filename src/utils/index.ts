export const widthMargin = 20;
export const heightMargin = 80;

export const windowToCanvas = (x: number, y: number) => {};
/**
 *
 * @param widthOffset 高度距离两边距离
 * @param heightOffset 高度距离两边距离
 * @param stageWidth 舞台宽
 * @param stageHeight 舞台高
 * @param boarwidth 画板宽
 * @param boarheight 画板高
 * @returns
 */
export const containResize = (
  stageWidth: number,
  stageHeight: number,
  boarwidth: number,
  boarheight: number
) => {
  let width = stageWidth,
    height = stageHeight;
  if (
    boarwidth > boarheight ||
    (boarwidth === boarheight && stageWidth < stageHeight)
  ) {
    height = (boarheight * width) / boarwidth;
  } else if (
    boarwidth < boarheight ||
    (boarwidth === boarheight && stageWidth > stageHeight)
  ) {
    width = (boarwidth * height) / boarheight;
  }
  return {
    width,
    height
  };
};

export const setRatioCenter = (
  width: number,
  height: number,
  stageWidth: number,
  stageHeight: number,
  boardWidth: number,
  boardHeight: number
) => {
  let ratio = 1;
  if (width === height) {
    ratio = (width - widthMargin) / boardWidth;
    if (stageHeight - heightMargin < ratio * boardHeight) {
      ratio = (stageHeight - heightMargin) / boardHeight;
    }
  } else if (width === stageWidth) {
    ratio = (width - widthMargin) / boardWidth;
    if (stageHeight - heightMargin < ratio * boardHeight) {
      ratio = (stageHeight - heightMargin) / boardHeight;
    }
  } else if (height === stageHeight) {
    ratio = (height - heightMargin) / boardHeight;
    if (stageWidth - widthMargin < ratio * boardWidth) {
      ratio = (stageWidth - widthMargin) / boardWidth;
    }
  } else {
    console.log('otherrrrrrrrr');
  }
  ratio = +ratio.toFixed(2);

  const { x, y } = calcPosition(
    stageWidth,
    stageHeight,
    boardWidth * ratio,
    boardHeight * ratio
  );

  return {
    ratio,
    x,
    y
  };
};

export const calcPosition = (
  outWidth: number,
  outHeight: number,
  innerWidth: number,
  innerHeight: number
) => {
  let x: number, y: number;
  x = (outWidth - innerWidth) / 2;
  y = (outHeight - innerHeight) / 2;

  return {
    x,
    y
  };
};

export const calcStageSize = (width: number, height: number) => {
  let stageWidth = width % 2 !== 0 ? width - 1 : width;
  let stageHeight = height % 2 !== 0 ? height - 1 : height;
  return {
    stageWidth,
    stageHeight
  };
};

/**
 * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth width of source image
 * @param {Number} srcHeight height of source image
 * @param {Number} maxWidth maximum available width
 * @param {Number} maxHeight maximum available height
 * @return {Object} { width, height }
 */
export function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
) {
  let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return { width: srcWidth * ratio, height: srcHeight * ratio };
}

export function innerWtihOuterBoxRatio(
  cx: number,
  cy: number,
  ox: number,
  oy: number,
  width: number,
  height: number
) {
  return {
    x: (cx - ox) / width,
    y: (cy - oy) / height
  };
}
