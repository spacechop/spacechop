import { collectDefaultMetrics, register } from 'prom-client';
import {
  bytesMimeCounter,
  bytesOriginalCounter,
  bytesPresetCounter,
  bytesStorageCounter,
  responseTimeHistogram,
  responseTimeMimeCounter,
  responseTimeOriginalCounter,
  responseTimePresetCounter,
  responseTimeStorageCounter,
  statusCodeCounter,
  transformationMimeCounter,
  transformationOriginalCounter,
  transformationPresetCounter,
  transformationStorageCounter,
} from './metrics';
import ResponseMonitor from './response-monitor';

if (process.env.PRODUCTION) {
  // Probe every 5th second.
  collectDefaultMetrics({ timeout: 5000 });
}

const monitorResponse = (res: Response) => {
  const rm = new ResponseMonitor(res);
  rm.monitor().then(({ statusCode, time, headers, size }) => {
    let contentType;
    let storage;
    let preset;
    let key;
    if (headers) {
      if (headers['content-type']) {
        contentType = headers['content-type'];
      }
      if (headers['x-cache']) {
        storage = headers['x-cache'];
      }
      if (headers['x-preset']) {
        preset = headers['x-preset'];
      }
      if (headers['x-key']) {
        key = headers['x-key'];
      }
    }

    statusCodeCounter.labels('' + statusCode).inc();
    responseTimeHistogram.observe(time);

    if (statusCode === 200) {
      if (contentType) {
        transformationMimeCounter.labels(contentType).inc();
        bytesMimeCounter.labels(contentType).inc(size);
        responseTimeMimeCounter.labels(contentType).inc(time);
      }
      if (storage) {
        transformationStorageCounter.labels(storage).inc();
        bytesStorageCounter.labels(storage).inc(size);
        responseTimeStorageCounter.labels(storage).inc(time);
      }
      if (preset) {
        transformationPresetCounter.labels(preset).inc();
        bytesPresetCounter.labels(preset).inc(size);
        responseTimePresetCounter.labels(preset).inc(time);
      }
      if (key) {
        transformationOriginalCounter.labels(key).inc();
        bytesOriginalCounter.labels(key).inc(size);
        responseTimeOriginalCounter.labels(key).inc(time);
      }
    }
  });
};

const getMetrics = () => register.metrics();

export default {
  monitorResponse,
  getMetrics,
};
