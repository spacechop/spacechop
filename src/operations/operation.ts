import { DefinitionRequirement, ExtraRequirement, ImageDefinition } from '../types';

export default interface Operation {
  requirements(): DefinitionRequirement;
  execute(state: ImageDefinition): {
    state: ImageDefinition,
    command: string,
    extra?: ExtraRequirement,
  };
}
