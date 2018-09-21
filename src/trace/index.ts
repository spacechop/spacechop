import uuid from 'uuid/v1';
import logger from './logger';
import serialize from './serialize';

export default class Trace {
  private uuid: string;
  private start: [number, number];
  public constructor() {
    this.uuid = uuid();
    this.start = process.hrtime();
  }

  public log(label, ...message: any[]) {
    logger.log({
      level: 'info',
      label,
      message: serialize(message),
      data: message,
      uuid: this.uuid,
    });
  }

  public warn(label, ...message: any[]) {
    logger.log({
      level: 'warn',
      label,
      message: serialize(message),
      data: message,
      uuid: this.uuid,
    });
  }

  public error(label, ...message: any[]) {
    logger.log({
      level: 'error',
      label,
      message: serialize(message),
      data: message,
      uuid: this.uuid,
    });
  }

  public end() {
    const hrtime = process.hrtime(this.start);
    const nanoseconds = (hrtime[0] * 1e9) + hrtime[1];
    const milliseconds = nanoseconds / 1e6;

    logger.log({
      level: 'info',
      label: 'time',
      uuid: this.uuid,
      message: serialize(['total time: ', milliseconds]),
      data: milliseconds,
    });
  }
}
