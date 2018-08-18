import express from 'express';
import fs from 'fs';
import setupRoutes from './spacechop';
import loadConfig from './config';

// read initial config.
let config = loadConfig();
// create server.
const app = express();
// create and setup router.
let router = express.Router();
// Setup routes for the SpaceChop service.
setupRoutes(config, router);
// Enable reloading of routes runtime by using a simple router that we switch out.
app.use(function (req, res, next) {
  // pass through requests to the router.
  router(req, res, next);
});


// Re-Initialize routes when new config is loaded.
fs.watchFile('/config.yml', { interval: 1000 }, async () => {
  console.log('Reloading config...');
  router = express.Router();
  config = loadConfig();
  setupRoutes(config, router);
  console.log('Listening on port 3000');
});

// start listening on port.
app.listen(3000, () => console.log('Listening on port 3000'));
