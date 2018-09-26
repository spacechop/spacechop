import path from 'path';
import createTransformedStream from '../../../test/utils/createTransformedStream';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';
import { allGravities } from '../../Gravity';
import ImageDefinition from './../../../imagedef';
import Fill from './../index';
import { FillConfig } from './../types';

expect.extend({ toMatchImageSnapshot });

describe('Fill', () => {
  describe('Requirements', () => {
    it('should require face detection if gravity = face', () => {
      const r = new Fill({
        width: 200,
        height: 200,
        gravity: 'face',
      });
      const requirements = r.requirements();
      expect(requirements).toContain('faces');
    });

    it('should not have any requirements by default', () => {
      const compress = new Fill({ width: 200, height: 200 });
      expect(compress.requirements()).toEqual([]);
    });
  });

  describe('Transformation of state', () => {
    describe('width & height', () => {
      it('should not return same state', () => {
        const r = new Fill({ width: 200, height: 200 });
        const stateBefore: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };
        const { state: stateAfter } = r.execute(stateBefore);
        expect(stateBefore === stateAfter).toBe(false);
      });

      const defaultConfig: FillConfig = { width: 200, height: 200 };
      const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };
      it('should update width & height', () => {
        const op = new Fill(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(expect.objectContaining({
          width: 200,
          height: 200,
        }));
      });

      it('should not update type', () => {
        const op = new Fill(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(expect.objectContaining({
          type: defaultState.type,
        }));
      });
    });

    describe('update faces', () => {
      describe('bottom right', () => {
        const defaultConfig: FillConfig = {
          width: 200,
          height: 200,
          gravity: 'face',
        };
        const defaultState: ImageDefinition = {
          height: 400,
          width: 400,
          type: 'jpeg',
          faces: [{
            x: 200,
            y: 200,
            width: 100,
            height: 100,
          }],
        };

        it('should update position on face', () => {
          const op = new Fill(defaultConfig);
          const { state } = op.execute(defaultState);
          expect(state).toEqual(
            expect.objectContaining({
              width: 200,
              height: 200,
              faces: expect.arrayContaining([
                expect.objectContaining({
                  x: 100,
                  y: 100,
                  width: 50,
                  height: 50,
                }),
              ]),
            }),
          );
        });
      });

      describe('top left', () => {
        const defaultConfig: FillConfig = {
          width: 200,
          height: 200,
          gravity: 'face',
        };
        const defaultState: ImageDefinition = {
          height: 400,
          width: 400,
          type: 'jpeg',
          faces: [{
            x: 100,
            y: 100,
            width: 100,
            height: 100,
          }],
        };

        it('should update position on face', () => {
          const op = new Fill(defaultConfig);
          const { state } = op.execute(defaultState);
          expect(state).toEqual(
            expect.objectContaining({
              width: 200,
              height: 200,
              faces: expect.arrayContaining([
                expect.objectContaining({
                  x: 50,
                  y: 50,
                  width: 50,
                  height: 50,
                }),
              ]),
            }),
          );
        });
      });

      describe('center', () => {
        const defaultConfig: FillConfig = {
          width: 200,
          height: 200,
          gravity: 'face',
        };
        const defaultState: ImageDefinition = {
          height: 400,
          width: 400,
          type: 'jpeg',
          faces: [{
            x: 150,
            y: 150,
            width: 100,
            height: 100,
          }],
        };

        it('should update position on face', () => {
          const op = new Fill(defaultConfig);
          const { state } = op.execute(defaultState);
          expect(state).toEqual(
            expect.objectContaining({
              width: 200,
              height: 200,
              faces: expect.arrayContaining([
                expect.objectContaining({
                  x: 75,
                  y: 75,
                  width: 50,
                  height: 50,
                }),
              ]),
            }),
          );
        });
      });

      describe('crop height', () => {
        const defaultConfig: FillConfig = {
          width: 200,
          height: 200,
          gravity: 'face',
        };
        const defaultState: ImageDefinition = {
          height: 600,
          width: 400,
          type: 'jpeg',
          faces: [{
            x: 150,
            y: 250,
            width: 100,
            height: 100,
          }],
        };

        it('should update position on face', () => {
          const op = new Fill(defaultConfig);
          const { state } = op.execute(defaultState);
          expect(state).toEqual(
            expect.objectContaining({
              width: 200,
              height: 200,
              faces: expect.arrayContaining([
                expect.objectContaining({
                  x: 75,
                  y: 75,
                  width: 50,
                  height: 50,
                }),
              ]),
            }),
          );
        });
      });

      describe('crop width', () => {
        const defaultConfig: FillConfig = {
          width: 200,
          height: 200,
          gravity: 'face',
        };
        const defaultState: ImageDefinition = {
          height: 400,
          width: 600,
          type: 'jpeg',
          faces: [{
            x: 250,
            y: 150,
            width: 100,
            height: 100,
          }],
        };

        it('should update position on face', () => {
          const op = new Fill(defaultConfig);
          const { state } = op.execute(defaultState);
          expect(state).toEqual(
            expect.objectContaining({
              width: 200,
              height: 200,
              faces: expect.arrayContaining([
                expect.objectContaining({
                  x: 75,
                  y: 75,
                  width: 50,
                  height: 50,
                }),
              ]),
            }),
          );
        });
      });
    });
  });

  describe('Command', () => {
    describe('width & height', () => {
      const defaultConfig: FillConfig = { width: 200, height: 200 };
      const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

      it('should use width & height', () => {
        const op = new Fill(defaultConfig);
        const { command } = op.execute(defaultState);
        expect(command).toEqual(expect.stringMatching(/-resize 200x200\^/));
      });

      it('should use gravity', () => {
        const op = new Fill({ ...defaultConfig, gravity: 'east'});
        const { command } = op.execute(defaultState);
        expect(command).toEqual(expect.stringMatching(/-gravity East/));
      });
    });

    describe('face crop', () => {
      describe('width & height', () => {
        const defaultConfig: FillConfig = {
          width: 200,
          height: 200,
          gravity: 'face',
        };
        const defaultState: ImageDefinition = {
          height: 400,
          width: 600,
          type: 'jpeg',
          faces: [{
            x: 200,
            y: 200,
            width: 100,
            height: 100,
          }],
        };

        it('should set correct width, height and offset', () => {
          const op = new Fill(defaultConfig);
          const { command } = op.execute(defaultState);
          expect(command).toEqual(expect.stringMatching(/-resize 200x200\^/));
          expect(command).toEqual(expect.stringMatching(/-extent 200x200\+25\+0/));
        });

        it('should set correct gravity', () => {
          const op = new Fill(defaultConfig);
          const { command } = op.execute(defaultState);
          expect(command).toEqual(expect.stringMatching(/-gravity NorthWest/));
        });
      });
    });
  });

  describe('Image similarity', () => {
    const defaultConfig: FillConfig = { width: 50, height: 25 };
    const defaultState: ImageDefinition = { width: 100, height: 100, type: 'jpeg' };

    const gridPathJPEG: string = path.join(__dirname, '../../../test/assets', 'grid.jpg');
    const gridPathPNG: string = path.join(__dirname, '../../../test/assets', 'grid.png');
    const gridPathPNGInterlaced: string = path.join(__dirname, '../../../test/assets', 'grid-interlaced.png');
    const gridPathGIF: string = path.join(__dirname, '../../../test/assets', 'grid.gif');
    const facePathJPEG: string = path.join(__dirname, '../../../test/assets', 'small-face.jpg');

    // Add fixtures for all gravities on grid image
    for (const gravity of allGravities) {
      // There are no faces in grid image, so testing for it is useless.
      if (gravity === 'face') {
        it(`Gravity JPEG ${gravity}`, async () => {
          const operation = new Fill({
            height: 50,
            width: 50,
            gravity,
          });
          const state: ImageDefinition = {
            width: 100,
            height: 126,
            type: 'jpeg',
            faces: [{
              x: 27,
              y: 32,
              width: 52,
              height: 52,
            }],
          };
          const result = createTransformedStream(facePathJPEG, operation, state);
          await expect(result).toMatchImageSnapshot({ extension: 'jpeg' });
        });
        continue;
      }

      it(`Gravity JPEG ${gravity}`, async () => {
        const result = createTransformedStream(
          gridPathJPEG,
          new Fill({ ...defaultConfig, gravity }),
          defaultState,
        );
        await expect(result).toMatchImageSnapshot({ extension: 'jpeg' });
      });

      it(`Gravity PNG ${gravity}`, async () => {
        const result = createTransformedStream(
          gridPathPNG,
          new Fill({ ...defaultConfig, gravity }),
          { ...defaultState, type: 'png' },
        );
        await expect(result).toMatchImageSnapshot({ extension: 'png' });
      });

      it(`Gravity interlaced PNG ${gravity}`, async () => {
        const result = createTransformedStream(
          gridPathPNGInterlaced,
          new Fill({ ...defaultConfig, gravity }),
          { ...defaultState, type: 'png', interlacing: true },
        );
        await expect(result).toMatchImageSnapshot({ extension: 'png' });
      });

      it(`Gravity GIF ${gravity}`, async () => {
        const result = createTransformedStream(
          gridPathGIF,
          new Fill({ ...defaultConfig, gravity }),
          { ...defaultState, type: 'gif' },
        );
        await expect(result).toMatchImageSnapshot({ extension: 'gif' });
      });
    }
  });
});
