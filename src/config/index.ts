import { SequelizeOptions } from 'sequelize-typescript';
import { Service } from 'typedi';
import getDbCongif from './db.config';

@Service()
export class AppConfiguration {
  private db = getDbCongif(process.env.NODE_ENV);
  private appPort = parseInt(process.env.PORT) || 4000;
  private jwtSecret = process.env.JWT_SECRET;
  private jwtExpiresIn = parseInt(process.env.JWT_EXPIRES_MIN) * 60;

  get dbConfig(): Partial<SequelizeOptions> {
    return this.db;
  }

  get port(): number {
    return this.appPort;
  }

  get secret(): string {
    return this.jwtSecret;
  }

  get jwtExpires(): number {
    return this.jwtExpiresIn;
  }
}
