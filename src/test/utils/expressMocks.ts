import { EventEmitter } from 'events';
import { Request as MockRequest } from 'jest-express/lib/request';
import { Response as MockResponse } from 'jest-express/lib/response';


// jest-express.Response does not implement EventEmitter
// so piping to the response does not work
export class Response extends MockResponse implements EventEmitter {
  public on() { return this; }
  public write() { return; }
  public once() { return this; }
  public addListener() { return this; }
  public prependListener() { return this; }
  public prependOnceListener() { return this; }
  public removeListener() { return this; }
  public removeAllListeners() { return this; }
  public off() { return this; }
  public setMaxListeners() { return this; }
  public getMaxListeners() { return 0; }
  public listeners() { return []; }
  public rawListeners() { return []; }
  public emit() { return true; }
  public eventNames() { return []; }
  public listenerCount() { return 0; }
}

export class Request extends MockRequest {}
