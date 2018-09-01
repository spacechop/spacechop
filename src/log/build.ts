// Build log row output.
const build = (
  proc: number,
  message: string,
  timestamp?: Date,
) => {
  const timeout = timestamp || new Date();
  const out = message
    .split('\n')
    .map((row) => `#${proc} ${timeout.toISOString()}: ${row}`)
    .join('\n');
  console.log(out);
  return out;
};

export default build;
