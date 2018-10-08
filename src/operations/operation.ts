import { DefinitionRequirement, ImageDefinition } from '../types/index.d';

export default interface Operation {
  requirements(): DefinitionRequirement[];
  execute(state: ImageDefinition): { state: ImageDefinition, command: string};
}
