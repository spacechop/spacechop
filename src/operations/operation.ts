import ImageDefinition, { DefinitionRequirement } from '../imagedef';

export default class Operation {
  public config: any;

  constructor(config: any) {
    this.config = config;
  }

  public requirements(): [DefinitionRequirement?] {
    return [];
  }

  public execute(state: ImageDefinition): { state: ImageDefinition, command: string } {
    return {
      command: 'exit 0',
      state,
    };
  }
}
