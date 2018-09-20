// Serialize anything passed to the log.
const serialize = (message: any) => {
  if (message === undefined) {
    return 'undefined';
  }
  if (message === Infinity) {
    return 'Infinity';
  }
  if (typeof message === 'string') {
    if (message.length === 0) {
      return '';
    }
    return message;
  }
  return JSON.stringify(message);
};

export default serialize;
