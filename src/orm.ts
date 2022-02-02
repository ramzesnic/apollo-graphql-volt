import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';
import { AppConfiguration } from './config';

@Service()
export class Orm {
  constructor(private readonly appConfig: AppConfiguration) {}

  async init(): Promise<void> {
    const config = this.appConfig.dbConfig;
    const sequelize = new Sequelize({
      ...config,
      repositoryMode: true,
      //models: [__dirname, '/models'],
    });
    await sequelize.sync({ force: true });
  }
}
