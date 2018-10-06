import { CropConfig } from '@spacechop/types';
import ImageDefinition from './../../../imagedef';
import Crop from './../index';

describe('Crop', () => {
  describe('Requirements', () => {
    it('should not have any requirements by default', () => {
      const compress = new Crop({});
      expect(compress.requirements()).toEqual([]);
    });

    it('should require face detection if gravity = face', () => {
      const r = new Crop({ gravity: 'face' });
      const requirements = r.requirements();
      expect(requirements).toContain('faces');
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

    describe('update faces', () => {
      describe('width and height', () => {
        const defaultConfig: CropConfig = {
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
          const op = new Crop(defaultConfig);
          const { state } = op.execute(defaultState);
          expect(state).toEqual(
            expect.objectContaining({
              width: 200,
              height: 200,
              faces: expect.arrayContaining([
                expect.objectContaining({
                  x: 50,
                  y: 50,
                  width: 100,
                  height: 100,
                }),
              ]),
            }),
          );
        });
      });

      describe('height only', () => {
        const defaultConfig: CropConfig = { height: 200, gravity: 'face' };
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
          const op = new Crop(defaultConfig);
          const { state } = op.execute(defaultState);
          expect(state).toEqual(
            expect.objectContaining({
              width: 400,
              height: 200,
              faces: expect.arrayContaining([
                expect.objectContaining({
                  x: 200,
                  y: 50,
                  width: 100,
                  height: 100,
                }),
              ]),
            }),
          );
        });
      });

      describe('width only', () => {
        const defaultConfig: CropConfig = { width: 200, gravity: 'face' };
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
          const op = new Crop(defaultConfig);
          const { state } = op.execute(defaultState);
          expect(state).toEqual(
            expect.objectContaining({
              width: 200,
              height: 400,
              faces: expect.arrayContaining([
                expect.objectContaining({
                  x: 50,
                  y: 200,
                  width: 100,
                  height: 100,
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

    describe('face crop', () => {
      describe('width & height', () => {
        const defaultConfig: CropConfig = {
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

        it('should set correct width, height and offset', () => {
          const op = new Crop(defaultConfig);
          const { command } = op.execute(defaultState);
          expect(command).toEqual(expect.stringMatching(/-crop 200x200\+50\+50/));
        });

        it('should set correct gravity', () => {
          const op = new Crop(defaultConfig);
          const { command } = op.execute(defaultState);
          expect(command).toEqual(expect.stringMatching(/-gravity Center/));
        });
      });

      describe('height only', () => {
        const defaultConfig: CropConfig = {
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

        it('should set correct width, height and offset', () => {
          const op = new Crop(defaultConfig);
          const { command } = op.execute(defaultState);
          expect(command).toEqual(expect.stringMatching(/-crop 400x200\+0\+50/));
        });

        it('should set correct gravity', () => {
          const op = new Crop(defaultConfig);
          const { command } = op.execute(defaultState);
          expect(command).toEqual(expect.stringMatching(/-gravity Center/));
        });
      });

      describe('width only', () => {
        const defaultConfig: CropConfig = {
          width: 200,
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

        it('should set correct width, height and offset', () => {
          const op = new Crop(defaultConfig);
          const { command } = op.execute(defaultState);
          expect(command).toEqual(expect.stringMatching(/-crop 200x400\+50\+0/));
        });

        it('should set correct gravity', () => {
          const op = new Crop(defaultConfig);
          const { command } = op.execute(defaultState);
          expect(command).toEqual(expect.stringMatching(/-gravity Center/));
        });
      });
    });
  });
});
