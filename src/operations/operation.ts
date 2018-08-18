import ImageDefinition, { DefinitionRequirement } from "../imagedef";

export interface OperationConfig {};

export default class Operation {
  config: OperationConfig;

  constructor(config: OperationConfig) {
    this.config = config;
  }

  requirements(): [DefinitionRequirement?] {
    return [];
  }

  execute(state: ImageDefinition): { state: ImageDefinition, command: String } {
    return {
      command: 'exit 0',
      state
    };
  }
}
