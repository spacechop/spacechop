import express from 'express';
import bodyParser from 'body-parser';
import matchPath from 'react-router/matchPath';

export default (port, handler, routePath = '/*') => new Promise(resolve => {
  if (!handler) {
    throw new Error('handler is required in createMockServer');
  }

  const app = express();
  app.use(bodyParser.json());
  let next;

  app.use('/*', (req, res) => {
    const pathname = req.originalUrl.replace(/\?.*/, '');
    if (matchPath(pathname, { path: routePath })) {
      handler(req, res);
      if (next) {
        next(pathname);
      }
    } else {
      res.end();
    }
  });

  let server = app.listen(port, () => {
    resolve({
      close: () => {
        server.close();
      },

      waitForPath: (path, timeout = 1000) => {
        return new Promise((resolve, reject) => {
          // Create a timeout if we are waiting for too long.
          const t = setTimeout(() => {
            next = null;
            reject('Timeout in waitForPath');
          }, timeout);

          // Create a method that is called by the server when receiving request.
          next = pathname => {
            if (!path || matchPath(pathname, { path })) {
              next = null;
              clearTimeout(t);
              resolve();
            }
          };
        });
      },
    });
  });
});
