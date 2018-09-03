import { Params } from '../../config/params';
import { PresetConfig } from '../../types/PresetConfig';
import populatePresetParams from '../populatePresetParams';

describe('Populate preset step params', () => {
  const preset: PresetConfig = {
    steps: [{
      $crop: {
        width: {
          from_path: 'width',
        },
        height: {
          from_path: 'height',
        },
      },
    }],
  };
  const params: Params =  {
    preset: null,
    width: 200,
    height: 200,
  };

  it('should populate params', () => {
    const steps = populatePresetParams(preset.steps, params);
    expect(steps).toMatchSnapshot();
  });
});
