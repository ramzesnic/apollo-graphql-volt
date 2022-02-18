import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { Service } from 'typedi';
import { AppConfiguration } from './config';
import models from './models';

@Service()
export class Orm {
  constructor(private readonly appConfig: AppConfiguration) {}

  async init(): Promise<Sequelize> {
    //const config = this.appConfig.dbConfig;
    const config: Partial<SequelizeOptions> = {
      dialect: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'development',
    };
    const sequelize = new Sequelize({
      ...config,
      repositoryMode: false,
      models: models,
    });
    await sequelize.sync({ force: false });

    return sequelize;
  }
}
