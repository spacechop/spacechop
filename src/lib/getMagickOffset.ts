export default (offset?: { x: number, y: number }): string => {
  const x = offset && offset.x || 0;
  const y = offset && offset.y || 0;
  return `${x >= 0 ? '+' : ''}${x}${y >= 0 ? '+' : ''}${y}`;
};
