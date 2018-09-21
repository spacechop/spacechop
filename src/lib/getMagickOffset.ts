export default (offset?: { x: number, y: number }): string => {
  const { x = 0, y = 0 } = offset || {};
  return `${x >= 0 ? '+' : ''}${x}${y >= 0 ? '+' : ''}${y}`;
};
