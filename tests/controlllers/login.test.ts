import * as dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server';
import { Sequelize } from 'sequelize';
import { Transaction } from 'sequelize';
import models from '../../src/models';
import * as sequelizeFixtures from 'sequelize-fixtures';
import { expect } from 'chai';
import { App } from '../../src/app';

dotenv.config({ path: 'tests/test.env' });

let transaction: Transaction;
let sequelize: Sequelize;
let server: ApolloServer;

const USER_FIXTURES = 'tests/fixtures/users-data.yml';

describe('Login test', () => {
  before(async () => {
    const app = await App.init();
    sequelize = app.getOrm();
    server = app.getServer();
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
    const result = await server.executeOperation({
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
