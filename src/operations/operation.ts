import ImageDefinition, { DefinitionRequirement } from '../imagedef';

export default interface Operation {
  requirements(): DefinitionRequirement[];
  execute(state: ImageDefinition): { state: ImageDefinition, command: string};
}
