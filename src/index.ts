import { createApp } from './app';

const {
  PORT = 3000,
} = process.env;

const app = createApp();

// export server to enable testing.
export let server;

// start listening on port.
server = app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
