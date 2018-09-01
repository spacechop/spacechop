import log from './log';
import serialize from './serialize';

const timing = {};

const time = (proc: number, message: any) => {
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

export default time;
