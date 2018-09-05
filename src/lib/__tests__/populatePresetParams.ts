import { Params } from '../../config/params';
import { PresetConfig } from '../../types/PresetConfig';
import populatePresetParams, { castValue } from '../populatePresetParams';

describe('Populate preset step params', () => {

  describe('.castValue', () => {
    it('should handle booleans', () => {
      expect(castValue('true')).toBe(true);
      expect(castValue('false')).toBe(false);
    });

    it('should handle numbers', () => {
      expect(castValue('100')).toBe(100);
      expect(castValue('0')).toBe(0);
      expect(castValue('-100')).toBe(-100);
      expect(castValue('0.1')).toBe(0.1);
      expect(castValue('-0.1')).toBe(-0.1);
    });
  });
  describe('Invalid parameter', () => {
    // A parameter is invalid if for example a string is provided
    // when a number is expected
    it('should throw an error', () => {
      const preset: PresetConfig = {
        steps: [{
          $crop: {
            width: { from_path: 'width' },
          },
        }],
      };
      const params: Params =  {
        preset: null,
        width: 'invalid',
      };
      expect(() => populatePresetParams(preset.steps, params)).toThrow();
    });
  });

  describe('Casting of types', () => {
    // All parameters will initially be strings as they're passed
    // as parts of the URL. .populatePresetParams should aggressively type check
    // in order to for example cast strings to numbers etc.
    it('should cast string to number', () => {
      const preset: PresetConfig = {
        steps: [{
          $crop: {
            width: { from_path: 'width' },
          },
        }],
      };
      const params: Params =  {
        preset: null,
        width: '100',
      };

      const steps = populatePresetParams(preset.steps, params);
      expect(steps).toEqual([{
        $crop: {
          width: 100,
        },
      }]);
    });
  });

  describe('Basic', () => {
    it('should handle non-path parameters', () => {
      const preset: PresetConfig = {
        steps: [{
          $crop: {
            width: 150,
            height: 200,
          },
        }],
      };
      const params: Params =  {
        preset: null,
      };
      const steps = populatePresetParams(preset.steps, params);
      expect(steps).toEqual([{
        $crop: {
          width: 150,
          height: 200,
        },
      }]);
    });
    it('should populate params if mapping contain same names', () => {
      const preset: PresetConfig = {
        steps: [{
          $crop: {
            width: { from_path: 'width' },
            height: { from_path: 'height' },
          },
        }],
      };
      const params: Params =  {
        preset: null,
        width: 100,
        height: 200,
      };
      const steps = populatePresetParams(preset.steps, params);
      expect(steps).toEqual([{
        $crop: {
          width: 100,
          height: 200,
        },
      }]);
    });
    it('should populate params if mapping contains different names', () => {
      const preset: PresetConfig = {
        steps: [{
          $crop: {
            width: { from_path: 'param1' },
            height: { from_path: 'param2' },
          },
        }],
      };
      const params: Params =  {
        preset: null,
        param1: 100,
        param2: 200,
      };
      const steps = populatePresetParams(preset.steps, params);
      expect(steps).toEqual([{
        $crop: {
          width: 100,
          height: 200,
        },
      }]);
    });
  });

});
