import chokidar from 'chokidar';
import express from 'express';
import loadConfig from './config';
import monitor from './monitor';
import setupRoutes from './spacechop';

const {
  PORT = 3000,
  PROMETHEUS_METRIC_PATH = '/_health',
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

// Re-Initialize routes when new config is loaded.
chokidar.watch('/config.yml', {
  usePolling: true,
  interval: 1000,
}).on('all', async () => {
  router = express.Router();
  config = loadConfig();
  setupRoutes(config, router, monitor);
});

app.get(PROMETHEUS_METRIC_PATH, (_, res) => {
  res.end(monitor.getMetrics());
});

// start listening on port.
server = app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
