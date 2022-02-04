import * as dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { AppConfiguration } from './config';
import { UserResolver } from './controllers/resolvers';
import { Orm } from './orm';
import { PostResolver } from './controllers/resolvers/post.resolver';

const bootstrap = async () => {
  dotenv.config();
  const config = Container.get(AppConfiguration);
  const orm = Container.get(Orm);

  await orm.init();

  const schema = await buildSchema({
    resolvers: [UserResolver, PostResolver],
    container: Container,
  });
  const service = new ApolloServer({ schema });

  await service.listen(config.port);
};

bootstrap();
