// Build log row output.
export const buildLogRow = (
  proc: number,
  message: string,
  delta?: number,
  timestamp?: Date,
) => {
  const timeout = timestamp || new Date();
  return `#${proc} ${timeout.toISOString()}${delta ? `(${delta}ms)` : ''}: ${message}`;
};

// Serialize anything passed to the log.
export const serialize = (message: any) => {
  if (message === undefined) {
    return 'undefined';
  }
  if (message === Infinity) {
    return 'Infinity';
  }
  if (typeof message === 'string') {
    if (message.length === 0) {
      return '';
    }
    return message;
  }
  return JSON.stringify(message);
};

export const log = (proc: number, message: any) => {
  const data = serialize(message);
  const row = buildLogRow(proc, data);
  process.stdout.write(row);
};

const timing = {};

export const time = (proc: number, message: any) => {
  const data = serialize(message);
  const key = `${process}.${data}`;
  if (!timing[key]) {
    timing[key] = process.hrtime();

  } else {
    const delta = process.hrtime(timing[key])[1] / 1000000;
    const row = buildLogRow(proc, data, delta);
    process.stdout.write(row);
  }
};
