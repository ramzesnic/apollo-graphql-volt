import * as dotenv from 'dotenv';
import { App } from './app';

const bootstrap = async () => {
  dotenv.config();
  const application = await App.init();
  const config = application.getConfig();
  //const server = application.getServer();
  const app = application.getApp();

  app.listen(config.port);
};

bootstrap();
