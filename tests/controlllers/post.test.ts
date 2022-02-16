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
const POST_FIXTURES = 'tests/fixtures/posts-data.yml';
const COMMENT_FIXTURES = 'tests/fixtures/comments-data.yml';
const POSTS_COUNT = 2;

describe('Post test', () => {
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
    //await sequelize.sync({ force: true });
    transaction = await sequelize.transaction();
    await sequelizeFixtures.loadFiles(
      [USER_FIXTURES, POST_FIXTURES, COMMENT_FIXTURES],
      { User: models[0], Post: models[1], Comment: models[2] },
      {
        transaction,
      },
    );
  });

  it('get posts', async () => {
    const query = gql`
      query Query($perPage: Float!, $page: Float!) {
        getPosts(per_page: $perPage, page: $page) {
          totalPosts
          pages
          isLastPage
          posts {
            id
            title
            body
            author {
              nickname
            }
            comments {
              body
            }
            published_at
          }
        }
      }
    `;
    const result = await server.executeOperation({
      query,
      variables: { perPage: 10, page: 1 },
    });
    expect(result.errors).to.be.undefined;
    const { totalPosts, pages, isLastPage, posts } = result.data.getPosts;
    //expect(totalPosts).to.equal(POSTS_COUNT);
    expect(pages).to.equal(1);
    expect(isLastPage).to.be.true;
    //expect(posts.length).to.equal(POSTS_COUNT);
  });

  it('get post', async () => {
    const query = gql`
      query GetPost($getPostId: Float!) {
        getPost(id: $getPostId) {
          id
          title
          body
          author {
            nickname
          }
          comments {
            body
          }
        }
      }
    `;
    const result = await server.executeOperation({
      query,
      variables: { getPostId: 1 },
    });
    const { title, author, comments } = result.data.getPost;
    //console.log(result.data.getPost);
    expect(result.errors).to.be.undefined;
    expect(title).to.equal('testTitle1');
    expect(author.nickname).to.equal('test1');
    expect(comments.length).to.equal(1);
  });

  it('create post', async () => {
    const query = gql`
      mutation Mutation($title: String!, $body: String!) {
        createPost(title: $title, body: $body) {
          id
          title
          body
        }
      }
    `;
    const postData = {
      title: 'createTitle',
      body: 'createBody',
    };
    const result = await server.executeOperation({
      query,
      variables: postData,
    });
    expect(result.errors).to.be.undefined;
    const { title, body, author } = result.data.createPost;
    expect(title).to.equal(postData.title);
    expect(body).to.equal(postData.body);
    //expect(author.nickname).to.equal('test1');
  });

  it('update post', async () => {
    const query = gql`
      mutation UpdatePost(
        $title: String!
        $body: String!
        $updatePostId: Float!
      ) {
        updatePost(title: $title, body: $body, id: $updatePostId) {
          id
          title
          body
        }
      }
    `;
    const postData = {
      title: 'updateTitle',
      body: 'updateBody',
      updatePostId: 1,
    };
    const result = await server.executeOperation({
      query,
      variables: postData,
    });
    expect(result.errors).to.be.undefined;
    const { title, body } = result.data.updatePost;
    expect(title).to.equal(postData.title);
    expect(body).to.equal(postData.body);
  });

  it('delete post', async () => {
    const query = gql`
      mutation DeletePost($deletePostId: Float!) {
        deletePost(id: $deletePostId) {
          id
        }
      }
    `;
    const postData = {
      deletePostId: 1,
    };
    const result = await server.executeOperation({
      query,
      variables: postData,
    });
    //console.log(result);
    expect(result.errors).to.be.undefined;
  });

  afterEach(async () => {
    await transaction.rollback();
    //await sequelize.dropAllSchemas({});
  });
});
