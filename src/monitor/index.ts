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
  let responseTime;
  let responseStatus;
  let contentType;
  let storage;
  let preset;
  let key;
  rm.monitor().then(({ statusCode, time, headers }) => {
    responseTime = time;
    responseStatus = statusCode;
    contentType = headers && headers['content-type'][1];
    storage = headers && headers['x-cache'][1];
    preset = headers && headers['x-preset'][1];
    key = headers && headers['x-key'][1];
  });

  return {
    close: (size: number) => {
      statusCodeCounter.labels(responseStatus).inc();
      responseTimeHistogram.observe(responseTime);

      if (responseStatus === 200) {
        if (contentType) {
          transformationMimeCounter.labels(contentType).inc();
          bytesMimeCounter.labels(contentType).inc(size);
          responseTimeMimeCounter.labels(contentType).inc(responseTime);
        }
        if (storage) {
          transformationStorageCounter.labels(storage).inc();
          bytesStorageCounter.labels(storage).inc(size);
          responseTimeStorageCounter.labels(storage).inc(responseTime);
        }
        if (preset) {
          transformationPresetCounter.labels(preset).inc();
          bytesPresetCounter.labels(preset).inc(size);
          responseTimePresetCounter.labels(preset).inc(responseTime);
        }
        if (key) {
          transformationOriginalCounter.labels(key).inc();
          bytesOriginalCounter.labels(key).inc(size);
          responseTimeOriginalCounter.labels(key).inc(responseTime);
        }
      }
    },
  };
};

const getMetrics = () => register.metrics();

export default {
  monitorResponse,
  getMetrics,
};
