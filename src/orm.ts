import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';
import { AppConfiguration } from './config';
import models from './models';

@Service()
export class Orm {
  constructor(private readonly appConfig: AppConfiguration) {}

  async init(): Promise<Sequelize> {
    const config = this.appConfig.dbConfig;
    const sequelize = new Sequelize({
      ...config,
      repositoryMode: false,
      models: models,
    });
    await sequelize.sync({ force: false });

    return sequelize;
  }
}
