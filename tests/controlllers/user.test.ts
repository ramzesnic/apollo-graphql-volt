import * as dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server-express';
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
const USERS_COUNT = 2;

describe('User test', () => {
  before(async () => {
    const makeContext = ({ req }) => ({
      headers: req?.headers,
      user: {
        id: 1,
      },
    });

    const app = await App.init(makeContext);
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

  it('get users', async () => {
    const query = gql`
      query GetUsers {
        getUsers {
          id
          nickname
          email
          password
        }
      }
    `;
    const result = await server.executeOperation({
      query,
    });
    expect(result.errors).to.be.undefined;
    const expectUsers: number = result.data.getUsers.length;
    expect(expectUsers).to.equal(USERS_COUNT);
  });

  it('get user', async () => {
    const query = gql`
      query GetUsers($getUserId: Float!) {
        getUser(id: $getUserId) {
          id
          nickname
          email
          password
        }
      }
    `;
    const result = await server.executeOperation({
      query,
      variables: { getUserId: 1 },
    });
    expect(result.errors).to.be.undefined;
    expect(result.data.getUser.nickname).to.equal('test1');
  });

  it('create user', async () => {
    const query = gql`
      mutation Mutation(
        $nickname: String!
        $email: String!
        $password: String!
      ) {
        createUser(nickname: $nickname, email: $email, password: $password) {
          id
          nickname
          email
          password
        }
      }
    `;
    const userData = {
      nickname: 'testCreate',
      email: 'testCreate@test.com',
      password: 'uegwfuywegf',
    };
    const result = await server.executeOperation({
      query,
      variables: userData,
    });
    expect(result.errors).to.be.undefined;
    expect(result.data.createUser.nickname).to.equal(userData.nickname);
  });

  it('update user', async () => {
    const query = gql`
      mutation UpdateUser(
        $nickname: String!
        $email: String!
        $password: String!
        $updateUserId: Float!
      ) {
        updateUser(
          nickname: $nickname
          email: $email
          password: $password
          id: $updateUserId
        ) {
          id
          nickname
          email
        }
      }
    `;
    const userData = {
      nickname: 'testCreate',
      email: 'testCreate@test.com',
      password: 'uegwfuywegf',
      updateUserId: 1,
    };
    const result = await server.executeOperation({
      query,
      variables: userData,
    });
    expect(result.errors).to.be.undefined;
    expect(result.data.updateUser.nickname).to.equal(userData.nickname);
    expect(result.data.updateUser.email).to.equal(userData.email);
  });

  it('delete user', async () => {
    const query = gql`
      mutation DeleteUser($deleteUserId: Float!) {
        deleteUser(id: $deleteUserId) {
          id
        }
      }
    `;
    const userData = {
      deleteUserId: 1,
    };
    const result = await server.executeOperation({
      query,
      variables: userData,
    });
    expect(result.errors).to.be.undefined;
  });

  afterEach(async () => {
    await transaction.rollback();
  });
});
