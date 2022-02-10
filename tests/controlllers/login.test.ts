import * as dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { AppConfiguration } from '../../src/config';
import { Orm } from '../../src/orm';
import { LoginResolver } from '../../src/controllers/resolvers/login.resolver';
import { userAuthChecker } from '../../src/controllers/guards/user-auth-checker';
import { AuthUtil } from '../../src/utils/auth.util';
import { Sequelize } from 'sequelize';
import { Transaction } from 'sequelize';
import models from '../../src/models';
import * as sequelizeFixtures from 'sequelize-fixtures';
import { expect } from 'chai';

// TODO add test.env file
dotenv.config({ path: 'tests/test.env' });

let transaction: Transaction;
let config: AppConfiguration;
let sequelize: Sequelize;
let service: ApolloServer;

const USER_FIXTURES = 'tests/fixtures/users-data.yml';

describe('Login test', () => {
  before(async () => {
    const orm = Container.get(Orm);
    config = Container.get(AppConfiguration);
    sequelize = await orm.init();

    const schema = await buildSchema({
      resolvers: [LoginResolver],
      container: Container,
      //globalMiddlewares: [BearerMiddleware],
      authChecker: userAuthChecker,
    });
    service = new ApolloServer({
      schema,
      context: AuthUtil.varifyUser(config.secret),
    });
  });

  beforeEach(async () => {
    transaction = await sequelize.transaction();
    await sequelizeFixtures.loadFile(
      USER_FIXTURES,
      { User: models[0], Post: models[1], Comment: models[2] },
      {
        transaction,
      },
    );
  });

  it('login success', async () => {
    const query = gql`
      query Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
        }
      }
    `;
    const result = await service.executeOperation({
      query,
      variables: { email: 'test1@mail.com', password: 'testpassword' },
    });
    expect(result.errors).to.be.undefined;
    expect(result.data?.login?.token).to.be.any;
  });

  afterEach(async () => {
    await transaction.rollback();
  });
});
