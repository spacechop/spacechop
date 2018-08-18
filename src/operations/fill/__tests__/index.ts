import path from 'path';
import Fill, { FillConfig } from './../index';
import { Gravity } from '../../Gravity';
import ImageDefinition, { DefinitionRequirement, ImageType } from './../../../imagedef'
import createTransformedStream from '../../../test/utils/createTransformedStream';
import toMatchImageSnapshot from '../../../test/utils/toMatchImageSnapshot';

expect.extend({ toMatchImageSnapshot });

describe('Fill', () => {
  describe('Requirements', () => {
    it('should require face detection if gravity = face', () => {
      const r = new Fill({
        width: 200,
        height: 200,
        gravity: Gravity.face,
      });
      const requirements = r.requirements();
      expect(requirements).toContain(DefinitionRequirement.FACES);
    });
  });

  describe('Transformation of state', () => {
    it('should not return same state', () => {
      const r = new Fill({ width: 200, height: 200 });
      const stateBefore: ImageDefinition = { height: 400, width: 400, type: ImageType.jpeg };
      const { state: stateAfter } = r.execute(stateBefore);
      expect(stateBefore === stateAfter).toBe(false);
    });
    
    const defaultConfig: FillConfig = { width: 200, height: 200 };
    const defaultState: ImageDefinition = { height: 400, width: 400, type: ImageType.jpeg };
    it('should update width & height', () => {
      const op = new Fill(defaultConfig);
      const { state } = op.execute(defaultState);
      expect(state).toEqual(expect.objectContaining({
        width: 200,
        height: 200
      }));
    })

    it('should not update type', () => {
      const op = new Fill(defaultConfig);
      const { state } = op.execute(defaultState);
      expect(state).toEqual(expect.objectContaining({
        type: defaultState.type
      }));
    });
  });

  describe('Command', () => {
    const defaultConfig: FillConfig = { width: 200, height: 200 };
    const defaultState: ImageDefinition = { height: 400, width: 400, type: ImageType.jpeg };

    it('should use width & height', () => {
      const op = new Fill(defaultConfig);
      const { command } = op.execute(defaultState);
      expect(command).toEqual(expect.stringMatching(/-resize 200x200\^/));
    })
    
    it('should use gravity', () => {
      const op = new Fill({ ...defaultConfig, gravity: Gravity.east });
      const { command } = op.execute(defaultState);
      expect(command).toEqual(expect.stringMatching(/-gravity East/));
    })
  });


  describe('Image similarity', () => {
    const defaultConfig: FillConfig = { width: 50, height: 25 };
    const defaultState: ImageDefinition = { width: 100, height: 100, type: ImageType.jpeg };

    const gridPathJPEG: string = path.join(__dirname, '../../../test/assets', 'grid.jpg');
    const gridPathPNG: string = path.join(__dirname, '../../../test/assets', 'grid.png');
    const gridPathPNGInterlaced: string = path.join(__dirname, '../../../test/assets', 'grid-interlaced.png');
    const gridPathGIF: string = path.join(__dirname, '../../../test/assets', 'grid.gif');

    // Add fixtures for all gravities on grid image
    for (const g of Object.keys(Gravity)) {

      // In grid image there are no faces so face gravity is useless.
      if (g === Gravity.face) continue;

      it(`Gravity JPEG ${g}`, async () => {
        const result = createTransformedStream(
          gridPathJPEG,
          new Fill({ ...defaultConfig, gravity: Gravity[g] }),
          defaultState
        );
        await expect(result).toMatchImageSnapshot({ extension: 'jpg' });
      });

      
      it(`Gravity PNG ${g}`, async () => {
        const result = createTransformedStream(
          gridPathPNG,
          new Fill({ ...defaultConfig, gravity: Gravity[g] }),
          { ...defaultState, type: ImageType.png }
        );
        await expect(result).toMatchImageSnapshot({ extension: 'png' });
      });

      it(`Gravity interlaced PNG ${g}`, async () => {
        const result = createTransformedStream(
          gridPathPNGInterlaced,
          new Fill({ ...defaultConfig, gravity: Gravity[g] }),
          { ...defaultState, type: ImageType.png, interlacing: true }
        );
        await expect(result).toMatchImageSnapshot({ extension: 'png' });
      });
      
      it(`Gravity GIF ${g}`, async () => {
        const result = createTransformedStream(
          gridPathGIF,
          new Fill({ ...defaultConfig, gravity: Gravity[g] }),
          { ...defaultState, type: ImageType.gif }
        );
        await expect(result).toMatchImageSnapshot({ extension: 'gif' });
      });
    }
  });
});
