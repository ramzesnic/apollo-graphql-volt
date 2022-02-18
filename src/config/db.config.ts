import { SequelizeOptions } from 'sequelize-typescript';

const config = {
  development: () => ({
    storage: './db.development.sqlite',
    dialect: 'sqlite',
  }),
  test: () => ({
    storage: ':memory:',
    dialect: 'sqlite',
  }),
  production: (
    host: string,
    port: number,
    username: string,
    password: string,
    database: string,
  ) => ({
    host,
    port,
    username,
    password,
    database,
    dialect: 'postgres',
  }),
};

export default (env: string, conf: any[]): Partial<SequelizeOptions> => {
  const dbConfig = config[env];
  return dbConfig(...conf);
};
