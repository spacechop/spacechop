import { Config, default as ConfigSource } from './Config';
import { DefinitionRequirement } from './DefinitionRequirement';
import { Format } from './Format';
import { Gravity } from './Gravity';
import { ImageDefinition } from './ImageDefinition';
import { ImageFaceBox } from './ImageFaceBox';
import { Param } from './Param';
import { PositiveNumber } from './PositiveNumber';
import { PresetConfig } from './PresetConfig';
import { Source } from './Source';
import { Step } from './Step';
import { StepConfig } from './StepConfig';
import { Storage } from './Storage';

const validate = (config) => {
  try {
    ConfigSource.check(config);
  } catch (err) {
    throw new Error(`${err.key ? `${err.key}: ` : ''}${err.message}`);
  }
};

export {
  validate as default,

  Config,
  DefinitionRequirement,
  Format,
  Gravity,
  ImageDefinition,
  ImageFaceBox,
  Param,
  PositiveNumber,
  PresetConfig,
  Source,
  Step,
  StepConfig,
  Storage,
};
