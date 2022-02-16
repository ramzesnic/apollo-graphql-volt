import * as dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server-express';
import { Sequelize } from 'sequelize';
import { Transaction } from 'sequelize';
import models from '../../src/models';
import * as sequelizeFixtures from 'sequelize-fixtures';
import { expect } from 'chai';
import { App } from '../../src/app';
import sinon from 'sinon';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { createReadStream } from 'fs';
import request from 'supertest';

dotenv.config({ path: 'tests/test.env' });

let transaction: Transaction;
let sequelize: Sequelize;
let server: ApolloServer;
let appExpress;

const USER_FIXTURES = 'tests/fixtures/users-data.yml';

describe('User test', () => {
  before(async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock(
      'S3',
      'upload',
      (params: AWS.S3.PutObjectRequest, callback: (err, res) => any) => {
        callback(null, { Location: params.Key });
      },
    );
    AWSMock.mock(
      'S3',
      'createBucket',
      (params: AWS.S3.CreateBucketRequest, callback: (err, res) => any) => {
        callback(null, { Location: 'Http://test.com/bucket/' });
      },
    );
    const makeContext = ({ req }) => ({
      headers: req?.headers,
      user: {
        id: 1,
      },
    });

    const app = await App.init(makeContext);
    sequelize = app.getOrm();
    server = app.getServer();
    const application = app.getApp();
    appExpress = application.listen(5000);
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

  it('upload avatar', async () => {
    const path = 'tests/files/logo.png';
    const file = createReadStream(path);
    const query = `
    mutation Mutation($setAvatarFile: Upload!, $setAvatarId: Float!) {
  setAvatar(file: $setAvatarFile, id: $setAvatarId) {
    id
    nickname
    avatar
  }
}
    `;
    const operations = {
      query,
      variables: {
        setAvatarFile:
          '/home/roman/projects/apollo-graphql-volt/tests/files/test.jpg',
        setAvatarId: 1,
      },
    };
    const response = await request('localhost:5000')
      .post('/graphql')
      .set('Content-Type', 'multipart/form-data')
      .field('operations', JSON.stringify(operations))
      .field('map', JSON.stringify({ '0': ['variables.setAvatarFile'] }))
      .attach('0', file)
      //.expect(({ body }) => body.data)
      .expect(200);

    //console.log(response);
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  after(async () => {
    AWSMock.restore('S3');
    await appExpress.close();
  });
});
