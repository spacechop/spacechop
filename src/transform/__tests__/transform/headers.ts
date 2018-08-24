import { createReadStream } from 'fs';
import path from 'path';
import assetsFolder from '../../../test/assets/dirname';
import transform from '../../index';

describe('Headers', () => {
  const img = path.join(assetsFolder, 'grid.jpg');
  let headers;
  beforeAll(async () => {
    const input = createReadStream(img);
    const result = await transform(input, []);
    headers = result.headers;
  });

  it('should set Content-Length', () => {
    expect(headers.contentLength).toBeDefined();
    expect(headers.contentLength).toBeGreaterThan(0);
  });
  it('should set Content-Type', () => {
    expect(headers.contentType).toBeDefined();
    expect(headers.contentType).toBe('image/jpeg');
  });
});
