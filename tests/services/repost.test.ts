import * as dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server-express';
import { Sequelize } from 'sequelize';
import { Transaction } from 'sequelize';
import models from '../../src/models';
import * as sequelizeFixtures from 'sequelize-fixtures';
import { expect } from 'chai';
import { App } from '../../src/app';
import { ReportService } from '../../src/services/report.service';
import Container from 'typedi';
import { Comment } from '../../src/models/comment';
import { Post } from '../../src/models/post';
import { User } from '../../src/models/user';

dotenv.config({ path: 'tests/test.env' });

let transaction: Transaction;
let sequelize: Sequelize;
let reportService: ReportService;

const USER_FIXTURES = 'tests/fixtures/users-data.yml';
const POST_FIXTURES = 'tests/fixtures/posts-data.yml';
const COMMENT_FIXTURES = 'tests/fixtures/comments-data.yml';

describe('Report test', () => {
  before(async () => {
    const makeContext = ({ req }) => ({
      headers: req?.headers,
      user: {
        id: 1,
      },
    });
    const app = await App.init(makeContext);
    sequelize = app.getOrm();
    reportService = Container.get(ReportService);
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    transaction = await sequelize.transaction();
    await sequelizeFixtures.loadFiles(
      [USER_FIXTURES, POST_FIXTURES, COMMENT_FIXTURES],
      { User: models[0], Post: models[1], Comment: models[2] },
      {
        transaction,
      },
    );
  });

  it('get report', async () => {
    const begin = new Date();
    const end = new Date();
    begin.setDate(begin.getDate() - 1);
    end.setDate(begin.getDate() + 1);
    const result = await reportService.makeReport(begin, end);
    //console.log(await User.findAll({ include: [Post, Comment] }));
    console.log(result);
  });

  afterEach(async () => {
    await transaction.rollback();
    await sequelize.dropAllSchemas({});
  });
});
