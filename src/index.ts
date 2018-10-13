import chokidar from 'chokidar';
import cluster from 'cluster';
import express from 'express';
import os from 'os';
import loadConfig from './config';
import monitor from './monitor';
import setupRoutes from './spacechop';

const {
  PORT = 3000,
  MONITOR_PATH = '/_health',
} = process.env;

// read initial config.
let config = loadConfig();
// create server.
const app = express();
app.disable('x-powered-by');

// export server to enable testing.
export let server;

// create and setup router.
let router = express.Router();
// Setup routes for the SpaceChop service.
setupRoutes(config, router, monitor);
// Enable reloading of routes runtime by using a simple router that we switch out.
app.use((req, res, next) => {
  // pass through requests to the router.
  router(req, res, next);
});

if (cluster.isMaster) {
  const workers = os.cpus().length;
  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }

  // Catching errors and creating new workers.
  cluster.on('exit', (worker, code, signal) => {
    console.info(
      'worker %d died (%s). restarting...',
      worker.process.pid, signal || code,
    );
    cluster.fork();
  });
} else {
  // Re-Initialize routes when new config is loaded.
  chokidar.watch('/config.yml', {
    usePolling: true,
    interval: 1000,
  }).on('all', async () => {
    console.info('Reloading config...');
    router = express.Router();
    config = loadConfig();
    setupRoutes(config, router, monitor);
  });

  app.get(MONITOR_PATH, (_, res) => {
    res.end(monitor.getMetrics());
  });

  // start listening on port.
  server = app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
}
