export default (pipeline, initialState) => {
  let currentState = initialState;
  const commands = [];
  for (const operation of pipeline) {
    const { command, state } = operation.execute(currentState);
    commands.push(command);
    currentState = state;
  }
  return { commands, state: currentState };
};
