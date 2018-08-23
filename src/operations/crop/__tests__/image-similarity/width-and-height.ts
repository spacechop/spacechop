import path from 'path';
import createTransformedStream from '../../../../test/utils/createTransformedStream';
import { allGravities } from '../../../Gravity';
import ImageDefinition from './../../../../imagedef';
import toMatchImageSnapshot from './../../../../test/utils/toMatchImageSnapshot';
import Crop from './../../index';
import { CropConfig } from './../../types';
expect.extend({ toMatchImageSnapshot });

describe('Image similarity - height only', () => {
  const defaultConfig: CropConfig = { height: 50, width: 50};
  const defaultState: ImageDefinition = { width: 100, height: 100, type: 'jpeg' };

  const assetsFolder = path.join(__dirname, './../../../../test/assets');
  const paths = {
    jpeg: path.join(assetsFolder, 'grid.jpg'),
    png: path.join(assetsFolder, 'grid.png'),
    png_interlaced: path.join(assetsFolder, 'grid-interlaced.png'),
    gif: path.join(assetsFolder, 'grid.gif'),
  };

  // Add fixtures for all gravities on grid image
  for (const gravity of allGravities) {
    // no faces in grid image so test is not needed
    if (gravity === 'face') { continue; }

    it(`Gravity JPEG ${gravity}`, async () => {
      const operation = new Crop({ ...defaultConfig, gravity });
      const result = createTransformedStream(paths.jpeg, operation, defaultState);
      await expect(result).toMatchImageSnapshot({ extension: 'jpeg'});
    });

    it(`Gravity PNG ${gravity}`, async () => {
      const operation = new Crop({ ...defaultConfig, gravity });
      const result = createTransformedStream(
        paths.png,
        operation,
        { ...defaultState, type: 'png' },
      );
      await expect(result).toMatchImageSnapshot({ extension: 'png'});
    });

    it(`Gravity PNG interlaced ${gravity}`, async () => {
      const operation = new Crop({ ...defaultConfig, gravity });
      const result = createTransformedStream(
        paths.png_interlaced,
        operation,
        { ...defaultState, type: 'png', interlacing: true },
      );
      await expect(result).toMatchImageSnapshot({ extension: 'png'});
    });

    it(`Gravity GIF ${gravity}`, async () => {
      const operation = new Crop({ ...defaultConfig, gravity });
      const result = createTransformedStream(
        paths.gif,
        operation,
        { ...defaultState, type: 'gif'},
      );
      await expect(result).toMatchImageSnapshot({ extension: 'gif'});
    });
  }
});
