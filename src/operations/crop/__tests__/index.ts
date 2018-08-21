import path from 'path';
import createTransformedStream from '../../../test/utils/createTransformedStream';
import { allGravities, Gravity } from '../../Gravity';
import ImageDefinition, { DefinitionRequirement } from './../../../imagedef';
import toMatchImageSnapshot from './../../../test/utils/toMatchImageSnapshot';
import Crop from './../index';
import { CropConfig } from './../types';
expect.extend({ toMatchImageSnapshot });

describe('Crop', () => {
  describe('Requirements', () => {
    it('should not have any requirements by default', () => {
      const compress = new Crop({});
      expect(compress.requirements()).toEqual([]);
    });

    it('should require face detection if gravity = face', () => {
      const r = new Crop({ gravity: 'face' });
      const requirements = r.requirements();
      expect(requirements).toContain(DefinitionRequirement.FACES);
    });
  });

  describe('Transformation of state', () => {
    describe('width & height', () => {
      const defaultConfig: CropConfig = { width: 200, height: 200 };
      const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

      it('should not return same state', () => {
        const r = new Crop(defaultConfig);
        const stateBefore: ImageDefinition = defaultState;
        const { state: stateAfter } = r.execute(stateBefore);
        expect(stateBefore === stateAfter).toBe(false);
      });

      it('should update width & height', () => {
        const op = new Crop(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(
          expect.objectContaining({
            width: 200,
            height: 200,
          }),
        );
      });

      it('should not update type', () => {
        const op = new Crop(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(
          expect.objectContaining({
            type: defaultState.type,
          }),
        );
      });
    });

    describe('width only', () => {
      const defaultConfig: CropConfig = { width: 200 };
      const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

      it('should not return same state', () => {
        const r = new Crop(defaultConfig);
        const stateBefore: ImageDefinition = defaultState;
        const { state: stateAfter } = r.execute(stateBefore);
        expect(stateBefore === stateAfter).toBe(false);
      });

      it('should update width & height', () => {
        const op = new Crop(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(
          expect.objectContaining({
            width: 200,
            height: 400,
          }),
        );
      });

      it('should not update type', () => {
        const op = new Crop(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(
          expect.objectContaining({
            type: defaultState.type,
          }),
        );
      });
    });

    describe('height only', () => {
      const defaultConfig: CropConfig = { height: 200 };
      const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

      it('should not return same state', () => {
        const r = new Crop(defaultConfig);
        const stateBefore: ImageDefinition = defaultState;
        const { state: stateAfter } = r.execute(stateBefore);
        expect(stateBefore === stateAfter).toBe(false);
      });

      it('should update width & height', () => {
        const op = new Crop(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(
          expect.objectContaining({
            width: 400,
            height: 200,
          }),
        );
      });

      it('should not update type', () => {
        const op = new Crop(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(
          expect.objectContaining({
            type: defaultState.type,
          }),
        );
      });
    });
  });

  describe('Command', () => {
    describe('width & height', () => {
      const defaultConfig: CropConfig = { width: 200, height: 200 };
      const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

      it('should set correct width & height', () => {
        const op = new Crop(defaultConfig);
        const { command } = op.execute(defaultState);
        expect(command).toEqual(expect.stringMatching(/-crop 200x200/));
      });

      it('should set correct gravity', () => {
        const op = new Crop({ ...defaultConfig, gravity: 'east'});
        const { command } = op.execute(defaultState);
        expect(command).toEqual(expect.stringMatching(/-gravity East/));
      });
    });

    describe('width only', () => {
      const defaultConfig: CropConfig = { width: 200 };
      const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

      it('should set correct width & height', () => {
        const op = new Crop(defaultConfig);
        const { command } = op.execute(defaultState);
        expect(command).toEqual(expect.stringMatching(/-crop 200x400/));
      });

      it('should set correct gravity', () => {
        const op = new Crop({ ...defaultConfig, gravity: 'east'});
        const { command } = op.execute(defaultState);
        expect(command).toEqual(expect.stringMatching(/-gravity East/));
      });
    });

    describe('height only', () => {
      const defaultConfig: CropConfig = { height: 200 };
      const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

      it('should set correct width & height', () => {
        const op = new Crop(defaultConfig);
        const { command } = op.execute(defaultState);
        expect(command).toEqual(expect.stringMatching(/-crop 400x200/));
      });

      it('should set correct gravity', () => {
        const op = new Crop({ ...defaultConfig, gravity: 'east'});
        const { command } = op.execute(defaultState);
        expect(command).toEqual(expect.stringMatching(/-gravity East/));
      });
    });
  });


  describe('Image similarity', () => {
    describe('width & height', () => {
      const defaultConfig: CropConfig = { width: 50, height: 50 };
      const defaultState: ImageDefinition = { width: 100, height: 100, type: 'jpeg' };

      const gridPathJPEG: string = path.join(__dirname, '../../../test/assets', 'grid.jpg');
      const gridPathPNG: string = path.join(__dirname, '../../../test/assets', 'grid.png');
      const gridPathPNGInterlaced: string = path.join(__dirname, '../../../test/assets', 'grid-interlaced.png');
      const gridPathGIF: string = path.join(__dirname, '../../../test/assets', 'grid.gif');

      // Add fixtures for all gravities on grid image
      for (const gravity of allGravities) {

        // In grid image there are no faces so face gravity is useless.
        if (gravity === 'face') { continue; }

        it(`Gravity JPEG ${gravity}`, async () => {
          const operation = new Crop({ ...defaultConfig, gravity });
          const result = createTransformedStream(gridPathJPEG, operation, defaultState);
          await expect(result).toMatchImageSnapshot({ extension: 'jpg'});
        });

        it(`Gravity PNG ${gravity}`, async () => {
          const operation = new Crop({ ...defaultConfig, gravity });
          const result = createTransformedStream(
            gridPathPNG,
            operation,
            { ...defaultState, type: 'png' },
          );
          await expect(result).toMatchImageSnapshot({ extension: 'png'});
        });

        it(`Gravity PNG interlaced ${gravity}`, async () => {
          const operation = new Crop({ ...defaultConfig, gravity });
          const result = createTransformedStream(
            gridPathPNGInterlaced,
            operation,
            { ...defaultState, type: 'png', interlacing: true },
          );
          await expect(result).toMatchImageSnapshot({ extension: 'png'});
        });

        it(`Gravity GIF ${gravity}`, async () => {
          const operation = new Crop({ ...defaultConfig, gravity });
          const result = createTransformedStream(
            gridPathGIF,
            operation,
            { ...defaultState, type: 'gif'},
          );
          await expect(result).toMatchImageSnapshot({ extension: 'gif'});
        });
      }
    });

    describe('width only', () => {
      const defaultConfig: CropConfig = { width: 50 };
      const defaultState: ImageDefinition = { width: 100, height: 100, type: 'jpeg' };

      const gridPathJPEG: string = path.join(__dirname, '../../../test/assets', 'grid.jpg');
      const gridPathPNG: string = path.join(__dirname, '../../../test/assets', 'grid.png');
      const gridPathPNGInterlaced: string = path.join(__dirname, '../../../test/assets', 'grid-interlaced.png');
      const gridPathGIF: string = path.join(__dirname, '../../../test/assets', 'grid.gif');

      // Add fixtures for all gravities on grid image
      for (const gravity of allGravities) {
        if (gravity === 'face') { continue; }
        it(`Gravity JPEG ${gravity}`, async () => {
          const operation = new Crop({ ...defaultConfig, gravity });
          const result = createTransformedStream(gridPathJPEG, operation, defaultState);
          await expect(result).toMatchImageSnapshot({ extension: 'jpg'});
        });

        it(`Gravity PNG ${gravity}`, async () => {
          const operation = new Crop({ ...defaultConfig, gravity });
          const result = createTransformedStream(
            gridPathPNG,
            operation,
            { ...defaultState, type: 'png' },
          );
          await expect(result).toMatchImageSnapshot({ extension: 'png'});
        });

        it(`Gravity PNG interlaced ${gravity}`, async () => {
          const operation = new Crop({ ...defaultConfig, gravity });
          const result = createTransformedStream(
            gridPathPNGInterlaced,
            operation,
            { ...defaultState, type: 'png', interlacing: true },
          );
          await expect(result).toMatchImageSnapshot({ extension: 'png'});
        });

        it(`Gravity GIF ${gravity}`, async () => {
          const operation = new Crop({ ...defaultConfig, gravity });
          const result = createTransformedStream(
            gridPathGIF,
            operation,
            { ...defaultState, type: 'gif'},
          );
          await expect(result).toMatchImageSnapshot({ extension: 'gif'});
        });
      }
    });

    describe('height only', () => {
      const defaultConfig: CropConfig = { height: 50 };
      const defaultState: ImageDefinition = { width: 100, height: 100, type: 'jpeg' };

      const gridPathJPEG: string = path.join(__dirname, '../../../test/assets', 'grid.jpg');
      const gridPathPNG: string = path.join(__dirname, '../../../test/assets', 'grid.png');
      const gridPathPNGInterlaced: string = path.join(__dirname, '../../../test/assets', 'grid-interlaced.png');
      const gridPathGIF: string = path.join(__dirname, '../../../test/assets', 'grid.gif');

      // Add fixtures for all gravities on grid image
      for (const gravity of allGravities) {
        if (gravity === 'face') { continue; }
        it(`Gravity JPEG ${gravity}`, async () => {
          const operation = new Crop({ ...defaultConfig, gravity });
          const result = createTransformedStream(gridPathJPEG, operation, defaultState);
          await expect(result).toMatchImageSnapshot({ extension: 'jpg'});
        });

        it(`Gravity PNG ${gravity}`, async () => {
          const operation = new Crop({ ...defaultConfig, gravity });
          const result = createTransformedStream(
            gridPathPNG,
            operation,
            { ...defaultState, type: 'png' },
          );
          await expect(result).toMatchImageSnapshot({ extension: 'png'});
        });

        it(`Gravity PNG interlaced ${gravity}`, async () => {
          const operation = new Crop({ ...defaultConfig, gravity });
          const result = createTransformedStream(
            gridPathPNGInterlaced,
            operation,
            { ...defaultState, type: 'png', interlacing: true },
          );
          await expect(result).toMatchImageSnapshot({ extension: 'png'});
        });

        it(`Gravity GIF ${gravity}`, async () => {
          const operation = new Crop({ ...defaultConfig, gravity });
          const result = createTransformedStream(
            gridPathGIF,
            operation,
            { ...defaultState, type: 'gif' },
          );
          await expect(result).toMatchImageSnapshot({ extension: 'gif'});
        });
      }
    });
  });
});
