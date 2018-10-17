export interface MagickOffset {
  x: number;
  y: number;
}

export default (offset?: MagickOffset): string => {
  const x = offset && offset.x || 0;
  const y = offset && offset.y || 0;
  return `${x >= 0 ? '+' : ''}${x}${y >= 0 ? '+' : ''}${y}`;
};
