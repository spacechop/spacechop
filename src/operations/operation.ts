import { DefinitionRequirement, ImageDefinition } from '../types';

export default interface Operation {
  requirements(state: ImageDefinition): DefinitionRequirement;
  execute(state: ImageDefinition): {
    state: ImageDefinition,
    command: string,
  };
}
