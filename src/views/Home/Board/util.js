/**
 *
 * @param {*} innerSize
 * @param {*} outerSize
 */
export const calcMaxScale = (innerSize, outerSize) => {
  const { width: outerWidth, height: outerHeight } = outerSize;
  const { width: innerWidth, height: innerHeight } = innerSize;

  const scale =
    outerWidth / outerHeight > innerWidth / innerHeight
      ? outerHeight / innerHeight
      : outerWidth / innerWidth;

  return scale;
};


export const calcPosition = (
  innerSize,
  outerSize
) => {
  const { width: outerWidth, height: outerHeight } = outerSize;
  const { width: innerWidth, height: innerHeight } = innerSize;
  let x, y;
  x = (outerWidth - innerWidth) / 2;
  y = (outerHeight - innerHeight) / 2;

  return {
    x,
    y
  };
};

export function innerWtihOuterBoxRatio(
  cx,
  cy,
  ox,
  oy,
  width,
  height
) {
  return {
    x: (cx - ox) / width,
    y: (cy - oy) / height
  };
}
