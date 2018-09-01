import console from '../lib/console';
import build from './build';
import serialize from './serialize';

const log = (proc: number, message: any) => {
  const data = serialize(message);
  const row = build(proc, data);
  console.info(row);
};

export default log;
