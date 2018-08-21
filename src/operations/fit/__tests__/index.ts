import path from 'path';
import createTransformedStream from '../../../test/utils/createTransformedStream';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';
import ImageDefinition from './../../../imagedef';
import Fit from './../index';
import { FitConfig } from './../types';

expect.extend({ toMatchImageSnapshot });

describe('Fit', () => {
  describe('Transformation of state', () => {
    describe('width & height', () => {
      const defaultConfig: FitConfig = { width: 200, height: 200 };
      const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

      it('should not return same state', () => {
        const r = new Fit(defaultConfig);
        const stateBefore = defaultState;
        const { state: stateAfter } = r.execute(stateBefore);
        expect(stateBefore === stateAfter).toBe(false);
      });

      it('update width & height', () => {
        const op = new Fit(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(expect.objectContaining({
          width: 200,
          height: 200,
        }));
      });

      it('dont update type', () => {
        const op = new Fit(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(expect.objectContaining({
          type: defaultState.type,
        }));
      });
    });

    describe('width only', () => {
      const defaultConfig: FitConfig = { width: 200 };
      const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

      it('should not return same state', () => {
        const r = new Fit(defaultConfig);
        const stateBefore = defaultState;
        const { state: stateAfter } = r.execute(stateBefore);
        expect(stateBefore === stateAfter).toBe(false);
      });

      it('update width & height', () => {
        const op = new Fit(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(expect.objectContaining({
          width: 200,
          height: 200,
        }));
      });

      it('dont update type', () => {
        const op = new Fit(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(expect.objectContaining({
          type: defaultState.type,
        }));
      });
    });

    describe('height only', () => {
      const defaultConfig: FitConfig = { height: 200 };
      const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

      it('should not return same state', () => {
        const r = new Fit(defaultConfig);
        const stateBefore = defaultState;
        const { state: stateAfter } = r.execute(stateBefore);
        expect(stateBefore === stateAfter).toBe(false);
      });

      it('update width & height', () => {
        const op = new Fit(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(expect.objectContaining({
          width: 200,
          height: 200,
        }));
      });

      it('dont update type', () => {
        const op = new Fit(defaultConfig);
        const { state } = op.execute(defaultState);
        expect(state).toEqual(expect.objectContaining({
          type: defaultState.type,
        }));
      });
    });
  });

  describe('Command', () => {
    const defaultConfig: FitConfig = { width: 200, height: 200 };
    const defaultState: ImageDefinition = { height: 400, width: 400, type: 'jpeg' };

    it('dont update type', () => {
      const op = new Fit(defaultConfig);
      const { command } = op.execute(defaultState);
      expect(command).toEqual(expect.stringMatching(/-resize 200x200/));
    });
  });


  describe('Image similarity', () => {
    describe('width & height', () => {
      const defaultConfig: FitConfig = { width: 50, height: 100 };
      const defaultState: ImageDefinition = { width: 100, height: 100, type: 'jpeg' };

      const gridPathJPEG: string = path.join(__dirname, '../../../test/assets', 'grid.jpg');
      const gridPathPNG: string = path.join(__dirname, '../../../test/assets', 'grid.png');
      const gridPathPNGInterlaced: string = path.join(__dirname, '../../../test/assets', 'grid-interlaced.png');
      const gridPathGIF: string = path.join(__dirname, '../../../test/assets', 'grid.gif');

      it('should correctly fit JPG', async () => {
        const result = createTransformedStream(
          gridPathJPEG,
          new Fit(defaultConfig),
          defaultState,
        );
        await expect(result).toMatchImageSnapshot({ extension: 'jpg' });
      });

      it('should correctly fit PNG', async () => {
        const result = createTransformedStream(
          gridPathPNG,
          new Fit(defaultConfig),
          { ...defaultState, type: 'png' },
        );
        await expect(result).toMatchImageSnapshot({ extension: 'png' });
      });

      it('should correctly fit interlaced PNG', async () => {
        const result = createTransformedStream(
          gridPathPNGInterlaced,
          new Fit(defaultConfig),
          { ...defaultState, type: 'png', interlacing: true },
        );
        await expect(result).toMatchImageSnapshot({ extension: 'png' });
      });

      it('should correctly fit GIF', async () => {
        const result = createTransformedStream(
          gridPathGIF,
          new Fit(defaultConfig),
          { ...defaultState, type: 'gif' },
        );
        await expect(result).toMatchImageSnapshot({ extension: 'gif' });
      });
    });

    describe('width only', () => {
      const defaultConfig: FitConfig = { width: 50 };
      const defaultState: ImageDefinition = { width: 100, height: 100, type: 'jpeg' };

      const gridPathJPEG: string = path.join(__dirname, '../../../test/assets', 'grid.jpg');
      const gridPathPNG: string = path.join(__dirname, '../../../test/assets', 'grid.png');
      const gridPathPNGInterlaced: string = path.join(__dirname, '../../../test/assets', 'grid-interlaced.png');
      const gridPathGIF: string = path.join(__dirname, '../../../test/assets', 'grid.gif');

      it('should correctly fit JPG', async () => {
        const result = createTransformedStream(
          gridPathJPEG,
          new Fit(defaultConfig),
          defaultState,
        );
        await expect(result).toMatchImageSnapshot({ extension: 'jpg' });
      });

      it('should correctly fit PNG', async () => {
        const result = createTransformedStream(
          gridPathPNG,
          new Fit(defaultConfig),
          { ...defaultState, type: 'png' },
        );
        await expect(result).toMatchImageSnapshot({ extension: 'png' });
      });

      it('should correctly fit interlaced PNG', async () => {
        const result = createTransformedStream(
          gridPathPNGInterlaced,
          new Fit(defaultConfig),
          { ...defaultState, type: 'png', interlacing: true },
        );
        await expect(result).toMatchImageSnapshot({ extension: 'png' });
      });

      it('should correctly fit GIF', async () => {
        const result = createTransformedStream(
          gridPathGIF,
          new Fit(defaultConfig),
          { ...defaultState, type: 'gif' },
        );
        await expect(result).toMatchImageSnapshot({ extension: 'gif' });
      });
    });
  });
});
