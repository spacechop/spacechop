export default (fn, errorHandler) => (req, res) => {
  return Promise
    .resolve(fn(req, res))
    .catch(errorHandler(res));
};
