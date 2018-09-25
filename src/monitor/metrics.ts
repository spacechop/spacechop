import { Counter, Histogram } from 'prom-client';

export const statusCodeCounter = new Counter({
  name: 'response_status_code',
  help: 'Status codes for responses',
  labelNames: ['code'],
});

export const responseTimeHistogram = new Histogram({
  name: 'response_time',
  help: 'Response time in millis',
  labelNames: ['time'],
  buckets: [150, 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500],
});

export const responseTimeMimeCounter = new Counter({
  name: 'response_time_mime',
  help: 'Response time per content type',
  labelNames: ['mime'],
});

export const responseTimeStorageCounter = new Counter({
  name: 'response_time_storage',
  help: 'Response time from storage',
  labelNames: ['storage'],
});

export const responseTimePresetCounter = new Counter({
  name: 'response_time_preset',
  help: 'Response time per preset',
  labelNames: ['preset'],
});

export const responseTimeOriginalCounter = new Counter({
  name: 'response_time_original',
  help: 'Response time per original',
  labelNames: ['original'],
});

export const transformationMimeCounter = new Counter({
  name: 'transformation_mime',
  help: 'Transformations served per content type',
  labelNames: ['mime'],
});

export const transformationStorageCounter = new Counter({
  name: 'transformations_storage',
  help: 'Transformations served from storage',
  labelNames: ['mode'], // could be HIT, MISS
});

export const transformationPresetCounter = new Counter({
  name: 'transformations_preset',
  help: 'Transformations served per preset',
  labelNames: ['preset'],
});

export const transformationOriginalCounter = new Counter({
  name: 'transformations_original',
  help: 'Transformations served per original',
  labelNames: ['original'],
});

export const bytesMimeCounter = new Counter({
  name: 'bytes_mime',
  help: 'Bytes served per content type',
  labelNames: ['mime'],
});

export const bytesStorageCounter = new Counter({
  name: 'bytes_storage',
  help: 'Bytes served from storage',
  labelNames: ['storage'],
});

export const bytesPresetCounter = new Counter({
  name: 'bytes_preset',
  help: 'Bytes served per preset',
  labelNames: ['preset'],
});

export const bytesOriginalCounter = new Counter({
  name: 'bytes_original',
  help: 'Bytes served per original',
  labelNames: ['original'],
});
