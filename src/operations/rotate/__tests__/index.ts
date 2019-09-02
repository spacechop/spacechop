import path from 'path';
import Rotate from '..';
import createTransformedStream from '../../../test/utils/createTransformedStream';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';
import { ImageDefinition } from './../../../types';
import { RotateConfig } from './../types';

expect.extend({ toMatchImageSnapshot });
describe('Rotate', () => {
  describe('Requirements', () => {
    it('should have exif requirements', () => {
      const compress = new Rotate({ angle: 0 });
      expect(compress.requirements()).toEqual(['exif']);
    });
  });
  describe('Transformation of state', () => {
    const defaultConfig: RotateConfig = { angle: 45 };
    const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

    it('should not return same state', () => {
      const r = new Rotate(defaultConfig);
      const stateBefore = defaultState;
      const { state: stateAfter } = r.execute(stateBefore);
      expect(stateBefore === stateAfter).toBe(false);
    });

    it('should update width & height', () => {
      const op = new Rotate(defaultConfig);
      const { state } = op.execute(defaultState);
      expect(state).toEqual(expect.objectContaining({
        width: 400,
        height: 400,
      }));
    });

    it('should not update type', () => {
      const op = new Rotate(defaultConfig);
      const { state } = op.execute(defaultState);
      expect(state).toEqual(expect.objectContaining({
        type: defaultState.type,
      }));
    });
  });

  describe('Command', () => {
    const angle = 45;
    const radians = angle * (Math.PI / 180);
    const width = 400;
    const height = 400;
    const scale = (Math.cos(radians) + Math.sin(radians)) * width;
    const defaultConfig: RotateConfig = { angle };
    const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

    it('should use correct width & height', () => {
      const op = new Rotate(defaultConfig);
      const { command } = op.execute(defaultState);
      expect(command).toEqual(expect.stringMatching(/-rotate 45/));
      expect(command).toEqual(expect.stringMatching(/-resize 142%/));
      expect(command).toEqual(expect.stringMatching(/-gravity center/));
      expect(command).toEqual(expect.stringMatching(/-extent 400x400/));
    });
  });

  describe('Image similarity', () => {
    describe('Numerical angle', () => {
      const defaultConfig: RotateConfig = { angle: 45 };
      const defaultState: ImageDefinition = { width: 67, height: 100, type: 'jpeg' };

      const Portrait_0: string = path.join(__dirname, '../../../test/assets', 'P0.jpg');

      it('should correctly rotate JPEG', async () => {
        const result = createTransformedStream(
          Portrait_0,
          new Rotate(defaultConfig),
          defaultState,
        );
        await expect(result).toMatchImageSnapshot({ extension: 'jpeg' });
      });
    });

    describe('portrait angle auto', () => {
      const defaultConfig: RotateConfig = { angle: 'auto' };

      for (let i = 0; i < 9; i++) {
        const image: string = path.join(__dirname, '../../../test/assets', `P${i}.jpg`);
        const defaultState: ImageDefinition = { width: i < 5 ? 67 : 100, height: i < 5 ? 100 : 67, type: 'jpeg', exif: { Orientation: i } };

        it(`should correct orientation=${i}`, async () => {
          const result = createTransformedStream(
            image,
            new Rotate(defaultConfig),
            defaultState,
          );
          await expect(result).toMatchImageSnapshot({ extension: 'jpeg' });
        });
      }
    });

    describe('landscape angle auto', () => {
      const defaultConfig: RotateConfig = { angle: 'auto' };

      for (let i = 0; i < 9; i++) {
        const image: string = path.join(__dirname, '../../../test/assets', `L${i}.jpg`);
        const defaultState: ImageDefinition = { width: i < 5 ? 67 : 100, height: i < 5 ? 100 : 67, type: 'jpeg', exif: { Orientation: i } };

        it(`should correct orientation=${i}`, async () => {
          const result = createTransformedStream(
            image,
            new Rotate(defaultConfig),
            defaultState,
          );
          await expect(result).toMatchImageSnapshot({ extension: 'jpeg' });
        });
      }
    });
  });
});
