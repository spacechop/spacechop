import path from 'path';
import Resize from '..';
import createTransformedStream from '../../../test/utils/createTransformedStream';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';
import { ImageDefinition } from './../../../types';
import { ResizeConfig } from './../types';

expect.extend({ toMatchImageSnapshot });
describe('Resize', () => {
  describe('Requirements', () => {
    it('should not have any requirements', () => {
      const compress = new Resize({ width: 200, height: 200 });
      expect(compress.requirements()).toEqual([]);
    });
  });
  describe('Transformation of state', () => {
    const defaultConfig: ResizeConfig = { width: 200, height: 200 };
    const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

    it('should not return same state', () => {
      const r = new Resize(defaultConfig);
      const stateBefore = defaultState;
      const { state: stateAfter } = r.execute(stateBefore);
      expect(stateBefore === stateAfter).toBe(false);
    });

    it('should update width & height', () => {
      const op = new Resize(defaultConfig);
      const { state } = op.execute(defaultState);
      expect(state).toEqual(expect.objectContaining({
        width: 200,
        height: 200,
      }));
    });

    it('should not update type', () => {
      const op = new Resize(defaultConfig);
      const { state } = op.execute(defaultState);
      expect(state).toEqual(expect.objectContaining({
        type: defaultState.type,
      }));
    });
  });

  describe('Command', () => {
    const defaultConfig: ResizeConfig = { width: 200, height: 200 };
    const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

    it('should use correct width & height', () => {
      const op = new Resize(defaultConfig);
      const { command } = op.execute(defaultState);
      expect(command).toEqual(expect.stringMatching(/-resize 200x200/));
    });
  });

  describe('Image similarity', () => {
    const defaultConfig: ResizeConfig = { width: 50, height: 100 };
    const defaultState: ImageDefinition = { width: 100, height: 100, type: 'jpeg' };

    const gridPathJPEG: string = path.join(__dirname, '../../../test/assets', 'grid.jpg');
    const gridPathPNG: string = path.join(__dirname, '../../../test/assets', 'grid.png');
    const gridPathPNGInterlaced: string = path.join(__dirname, '../../../test/assets', 'grid-interlaced.png');
    const gridPathGIF: string = path.join(__dirname, '../../../test/assets', 'grid.gif');

    it('should correctly resize JPEG', async () => {
      const result = createTransformedStream(
        gridPathJPEG,
        new Resize(defaultConfig),
        defaultState,
      );
      await expect(result).toMatchImageSnapshot({ extension: 'jpeg' });
    });

    it('should correctly resize PNG', async () => {
      const result = createTransformedStream(
        gridPathPNG,
        new Resize(defaultConfig),
        { ...defaultState, type: 'png' },
      );
      await expect(result).toMatchImageSnapshot({ extension: 'png' });
    });

    it('should correctly resize interlaced PNG', async () => {
      const result = createTransformedStream(
        gridPathPNGInterlaced,
        new Resize(defaultConfig),
        { ...defaultState, type: 'png', interlacing: true },
      );
      await expect(result).toMatchImageSnapshot({ extension: 'png' });
    });

    it('should correctly resize GIF', async () => {
      const result = createTransformedStream(
        gridPathGIF,
        new Resize(defaultConfig),
        { ...defaultState, type: 'gif' },
      );
      await expect(result).toMatchImageSnapshot({ extension: 'gif' });
    });
  });
});
