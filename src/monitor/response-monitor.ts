import { Response } from 'express';


export interface MonitorResult {
  headers: object;
  time: number;
  statusCode: number;
}
/*
 * Monitors a Node HTTPResponse object.
 *
 * Timing is calculated as time until the response has started to be sent.
 * It does not include time it took for the response to be downloaded by the client.
 *
 */
const hijack = (prev, listener?) => function(...args) {
  if (listener) {
    listener(...args);
  }
  prev.apply(this, args);
};

class ResponseMonitor {
  private res: Response;

  constructor(httpResponse) {
    this.res = httpResponse;
  }

  public monitor(): Promise<MonitorResult> {
    const hrstart = process.hrtime();
    return new Promise((resolve) => {
      this.res.writeHead = hijack(this.res.writeHead, (statusCode) => {
        const headers = this.res.getHeaders();
        const hrend = process.hrtime(hrstart);
        const time = (hrend[0] * 1000) + (hrend[1] / 1000000);
        resolve({ statusCode, time, headers });
      });
    });
  }
}

export {
  ResponseMonitor as default,
  hijack,
};
