import chokidar from 'chokidar';
import cluster from 'cluster';
import express from 'express';
import { cpus } from 'os';
import loadConfig from './config';
import setupRoutes from './spacechop';

// read initial config.
let config = loadConfig();
// create server.
const app = express();
app.disable('x-powered-by');

// create and setup router.
let router = express.Router();
// Setup routes for the SpaceChop service.
setupRoutes(config, router);
// Enable reloading of routes runtime by using a simple router that we switch out.
app.use((req, res, next) => {
  // pass through requests to the router.
  router(req, res, next);
});

// if (cluster.isMaster) {
//   const workers = cpus().length;
//   for (let i = 0; i < workers; i++) {
//     cluster.fork();
//   }
//
//   // Catching errors and creating new workers.
//   cluster.on('exit', (worker, code, signal) => {
//     console.info(
//       'worker %d died (%s). restarting...',
//       worker.process.pid, signal || code,
//     );
//     cluster.fork();
//   });
// } else {
// Re-Initialize routes when new config is loaded.
chokidar.watch('/config.yml', {
  usePolling: true,
  interval: 1000,
}).on('all', async () => {
  console.info('Reloading config...');
  router = express.Router();
  config = loadConfig();
  setupRoutes(config, router);
});

// start listening on port.
app.listen(3000, () => console.info('Listening on port 3000'));
// }
