import { createReadStream } from 'fs';
import path from 'path';
import transform from '../..';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';
import { Operation } from '../../../types/Operation';
import assetsFolder from './../../../test/assets/dirname';

expect.extend({ toMatchImageSnapshot });

describe('Transform 2 operations', () => {
  const assets = {
    cat: path.join(assetsFolder, 'cat.jpg'),
  };

  describe('$crop $format', () => {
    const steps: Operation[] = [
      { $crop: {
        width: 400,
        height: 400,
        gravity: 'center',
      }},
      { $format: {
        type: 'webp',
      }},
    ];
    it('should match snapshot', async () => {
      const input = createReadStream(assets.cat);
      const out = await transform(input, steps);

      await expect(out).toMatchImageSnapshot({ extension: 'webp' });
    });
  });

  describe('$crop $compress', () => {
    const steps: Operation[] = [
      { $crop: {
        width: 400,
        height: 400,
        gravity: 'center',
      }},
      { $compress: {
        quality: 50,
      }},
    ];
    it('should match snapshot', async () => {
      const input = createReadStream(assets.cat);
      const out = await transform(input, steps);

      await expect(out).toMatchImageSnapshot({ extension: 'jpeg' });
    });
  });

  describe('$fill $format', () => {
    const steps: Operation[] = [
      { $fill: {
        width: 400,
        height: 400,
        gravity: 'center',
      }},
      { $format: {
        type: 'webp',
      }},
    ];
    it('should match snapshot', async () => {
      const input = createReadStream(assets.cat);
      const out = await transform(input, steps);

      await expect(out).toMatchImageSnapshot({ extension: 'webp' });
    });
  });

  describe('$fill $compress', () => {
    const steps: Operation[] = [
      { $fill: {
        width: 400,
        height: 400,
        gravity: 'center',
      }},
      { $compress: {
        quality: 50,
      }},
    ];
    it('should match snapshot', async () => {
      const input = createReadStream(assets.cat);
      const out = await transform(input, steps);

      await expect(out).toMatchImageSnapshot({ extension: 'jpeg' });
    });
  });

  describe('$fit $format', () => {
    const steps: Operation[] = [
      { $fit: {
        width: 400,
        height: 400,
      }},
      { $format: {
        type: 'webp',
      }},
    ];
    it('should match snapshot', async () => {
      const input = createReadStream(assets.cat);
      const out = await transform(input, steps);

      await expect(out).toMatchImageSnapshot({ extension: 'webp' });
    });
  });

  describe('$fit $compress', () => {
    const steps: Operation[] = [
      { $fit: {
        width: 400,
        height: 400,
      }},
      { $compress: {
        quality: 50,
      }},
    ];
    it('should match snapshot', async () => {
      const input = createReadStream(assets.cat);
      const out = await transform(input, steps);

      await expect(out).toMatchImageSnapshot({ extension: 'jpeg' });
    });
  });

  describe('$crop $strip', () => {
    const steps: Operation[] = [
      { $crop: {
        width: 400,
        height: 400,
      }},
      { $strip: {
        icc_profile: true,
      }},
    ];
    it('should match snapshot', async () => {
      const input = createReadStream(assets.cat);
      const out = await transform(input, steps);

      await expect(out).toMatchImageSnapshot({ extension: 'jpeg' });
    });
  });
});
