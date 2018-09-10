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

  describe('$crop $format $compress', () => {
    const steps: Step[] = [
      { $crop: {
        width: 400,
        height: 400,
        gravity: 'center',
      }},
      { $format: {
        type: 'webp',
      }},
      { $compress: {
        quality: 50,
      }},
    ];
    it('should match snapshot', async () => {
      const input = createReadStream(assets.cat);
      const { stream } = await transform(input, steps);

      await expect(stream).toMatchImageSnapshot({ extension: 'webp' });
    });
  });

  describe('$crop $compress $strip', () => {
    const steps: Step[] = [
      { $crop: {
        width: 400,
        height: 400,
        gravity: 'center',
      }},
      { $compress: {
        quality: 50,
      }},
      { $strip: {
      }},
    ];
    it('should match snapshot', async () => {
      const input = createReadStream(assets.cat);
      const { stream } = await transform(input, steps);

      await expect(stream).toMatchImageSnapshot({ extension: 'jpeg' });
    });
  });

  describe('$fill $format $compress', () => {
    const steps: Step[] = [
      { $fill: {
        width: 400,
        height: 400,
        gravity: 'center',
      }},
      { $format: {
        type: 'webp',
      }},
      { $compress: {
        quality: 50,
      }},
    ];
    it('should match snapshot', async () => {
      const input = createReadStream(assets.cat);
      const { stream } = await transform(input, steps);

      await expect(stream).toMatchImageSnapshot({ extension: 'webp' });
    });
  });

  describe('$fill $compress $strip', () => {
    const steps: Step[] = [
      { $fill: {
        width: 400,
        height: 400,
        gravity: 'center',
      }},
      { $compress: {
        quality: 50,
      }},
      { $strip: {
      }},
    ];
    it('should match snapshot', async () => {
      const input = createReadStream(assets.cat);
      const { stream } = await transform(input, steps);

      await expect(stream).toMatchImageSnapshot({ extension: 'jpeg' });
    });
  });

  describe('$fit $format $compress', () => {
    const steps: Step[] = [
      { $fit: {
        width: 400,
        height: 400,
      }},
      { $format: {
        type: 'webp',
      }},
      { $compress: {
        quality: 50,
      }},
    ];
    it('should match snapshot', async () => {
      const input = createReadStream(assets.cat);
      const { stream } = await transform(input, steps);

      await expect(stream).toMatchImageSnapshot({ extension: 'webp' });
    });
  });

  describe('$fit $compress $strip', () => {
    const steps: Step[] = [
      { $fit: {
        width: 400,
        height: 400,
      }},
      { $compress: {
        quality: 50,
      }},
      { $strip: {}},
    ];
    it('should match snapshot', async () => {
      const input = createReadStream(assets.cat);
      const { stream } = await transform(input, steps);

      await expect(stream).toMatchImageSnapshot({ extension: 'jpeg' });
    });
  });
});
