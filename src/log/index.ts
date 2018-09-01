import log from './log';
import time, { clearTime } from './time';

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
