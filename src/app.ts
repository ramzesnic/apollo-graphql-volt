import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { AppConfiguration } from './config';
import { Orm } from './orm';
import { UserResolver } from './controllers/resolvers/user.resolver';
import { PostResolver } from './controllers/resolvers/post.resolver';
import { CommentResolver } from './controllers/resolvers/comment.resolver';
import { LoginResolver } from './controllers/resolvers/login.resolver';
//import { BearerMiddleware } from './controllers/middlewares/bearer.middleware';
import { userAuthChecker } from './controllers/guards/user-auth-checker';
import { AuthUtil } from './utils/auth.util';
import { Sequelize } from 'sequelize';
import { IContext } from './interfaces/icontext';

export class App {
  constructor(
    private readonly config: AppConfiguration,
    private readonly orm: Sequelize,
    private readonly server: ApolloServer,
  ) {}

  static async init(makeContext?: ({ req }: any) => IContext): Promise<App> {
    const config = Container.get(AppConfiguration);
    const orm = Container.get(Orm);
    const sequelize = await orm.init();

    const schema = await buildSchema({
      resolvers: [UserResolver, PostResolver, CommentResolver, LoginResolver],
      container: Container,
      //globalMiddlewares: [BearerMiddleware],
      authChecker: userAuthChecker,
    });
    const server = new ApolloServer({
      schema,
      context: makeContext ? makeContext : AuthUtil.varifyUser(config.secret),
    });
    return new App(config, sequelize, server);
  }

  getConfig(): AppConfiguration {
    return this.config;
  }

  getOrm(): Sequelize {
    return this.orm;
  }

  getServer(): ApolloServer {
    return this.server;
  }
}
