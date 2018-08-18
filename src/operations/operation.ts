import ImageDefinition, { DefinitionRequirement } from '../imagedef';

export interface OperationConfig {}

export default class Operation {
  public config: OperationConfig;

  constructor(config: OperationConfig) {
    this.config = config;
  }

  public requirements(): [DefinitionRequirement?] {
    return [];
  }

  public execute(state: ImageDefinition): { state: ImageDefinition, command: String } {
    return {
      command: 'exit 0',
      state,
    };
  }
}
