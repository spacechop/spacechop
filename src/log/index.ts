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
  if (message instanceof Array) {
    return message.map(serialize).join('\n');
  }
  return JSON.stringify(message, null, 2);
};

export const log = (proc: number, message: any) => {
  const data = serialize(message);
  const row = buildLogRow(proc, data);
  console.info(row);
};

const timing = {};

export const time = (proc: number, message: any) => {
  const data = serialize(message);
  const key = `${proc}.${data}`;
  if (!timing[key]) {
    timing[key] = process.hrtime();

  } else {
    const hrtime = process.hrtime(timing[key]);
    const nanoseconds = (hrtime[0] * 1e9) + hrtime[1];
    const milliseconds = nanoseconds / 1e6;
    delete timing[key];
    log(proc, [data, `${milliseconds}ms`]);
  }
};

export const clearTime = (proc: number, message: any) => {
  const data = serialize(message);
  const key = `${proc}.${data}`;
  delete timing[key];
};

let counter = 0;

export default class Log {
  private process: number;
  public constructor() {
    counter += 1;
    this.process = counter;
    time(this.process, 'total');
  }

  public log(...message: any[]): void {
    log(this.process, message);
  }

  public time(...message: any[]): void {
    time(this.process, message);
  }

  public clearTime(...message: any[]): void {
    clearTime(this.process, message);
  }

  public end(): void {
    time(this.process, 'total');
  }
}
