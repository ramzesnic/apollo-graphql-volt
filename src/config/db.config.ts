import { SequelizeOptions } from 'sequelize-typescript';

const config = {
  development: {
    storage: './db.development.sqlite',
    dialect: 'sqlite',
  },
  test: {
    storage: ':memory:',
    dialect: 'sqlite',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
  },
};
export default (env: string): Partial<SequelizeOptions> => config[env];
