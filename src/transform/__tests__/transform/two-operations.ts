import { createReadStream } from 'fs';
import path from 'path';
import transform from '../..';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';
import { Step } from '../../../types/Step';
import assetsFolder from './../../../test/assets/dirname';

expect.extend({ toMatchImageSnapshot });

describe('Transform 2 operations', () => {
  const assets = {
    cat: path.join(assetsFolder, 'cat.jpg'),
  };

  describe('$crop $format', () => {
    const steps: Step[] = [
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
      const { stream } = await transform(input, steps);

      await expect(stream).toMatchImageSnapshot({ extension: 'webp' });
    });
  });

  describe('$crop $compress', () => {
    const steps: Step[] = [
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
      const { stream } = await transform(input, steps);

      await expect(stream).toMatchImageSnapshot({ extension: 'jpeg' });
    });
  });

  describe('$fill $format', () => {
    const steps: Step[] = [
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
      const { stream } = await transform(input, steps);

      await expect(stream).toMatchImageSnapshot({ extension: 'webp' });
    });
  });

  describe('$fill $compress', () => {
    const steps: Step[] = [
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
      const { stream } = await transform(input, steps);

      await expect(stream).toMatchImageSnapshot({ extension: 'jpeg' });
    });
  });

  describe('$fit $format', () => {
    const steps: Step[] = [
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
      const { stream } = await transform(input, steps);

      await expect(stream).toMatchImageSnapshot({ extension: 'webp' });
    });
  });

  describe('$fit $compress', () => {
    const steps: Step[] = [
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
      const { stream } = await transform(input, steps);

      await expect(stream).toMatchImageSnapshot({ extension: 'jpeg' });
    });
  });

  describe('$crop $strip', () => {
    const steps: Step[] = [
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
      const { stream } = await transform(input, steps);

      await expect(stream).toMatchImageSnapshot({ extension: 'jpeg' });
    });
  });
});
