import * as dotenv from 'dotenv';
import { App } from './app';

const bootstrap = async () => {
  dotenv.config();
  const app = await App.init();
  const config = app.getConfig();
  const server = app.getServer();

  await server.listen(config.port);
};

bootstrap();
