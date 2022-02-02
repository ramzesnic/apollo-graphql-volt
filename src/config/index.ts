import { SequelizeOptions } from 'sequelize-typescript';
import { Service } from 'typedi';
import getDbCongif from './db.config';

@Service()
export class AppConfiguration {
  private db = getDbCongif(process.env.NODE_ENV);
  private appPort = parseInt(process.env.PORT) || 4000;

  get dbConfig(): Partial<SequelizeOptions> {
    return this.db;
  }

  get port(): number {
    return this.appPort;
  }
}
