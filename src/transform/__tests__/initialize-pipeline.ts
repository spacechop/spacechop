import initializePipeline from '../initialize-pipeline';

describe('Initialize pipeline', () => {
  it('should throw error if non-existant step is provided', () => {
    expect(() => initializePipeline([{ $dontExist: {}}])).toThrow();
  });
});
