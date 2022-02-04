import * as dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { AppConfiguration } from './config';
import { Orm } from './orm';
import { UserResolver } from './controllers/resolvers/user.resolver';
import { PostResolver } from './controllers/resolvers/post.resolver';
import { CommentResolver } from './controllers/resolvers/comment.resolver';
import { LoginResolver } from './controllers/resolvers/login.resolver';
import { BearerMiddleware } from './controllers/middlewares/bearer.middleware';
import { userAuthChecker } from './controllers/guards/user-auth-checker';
import * as jwt from 'jsonwebtoken';

const bootstrap = async () => {
  dotenv.config();
  const config = Container.get(AppConfiguration);
  const orm = Container.get(Orm);

  await orm.init();

  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver, CommentResolver, LoginResolver],
    container: Container,
    //globalMiddlewares: [BearerMiddleware],
    authChecker: userAuthChecker,
  });
  const service = new ApolloServer({
    schema,
    context: ({ req }) => {
      const authorization: string = req?.headers?.authorization || '';
      if (!authorization.startsWith('Bearer ')) {
        return {};
      }
      const token = authorization.split(' ')[1];
      console.log(token);
      let user;
      try {
        user = jwt.verify(token, config.secret);
      } catch (e) {
        console.log(e);
      }
      return {
        headers: req.headers,
        user,
      };
    },
  });

  await service.listen(config.port);
};

bootstrap();
