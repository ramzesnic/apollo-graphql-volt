import * as dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { AppConfiguration } from './config';
import { HelloResolver } from './controllers/resolvers';
import { Orm } from './orm';

const bootstrap = async () => {
  dotenv.config();
  const config = Container.get(AppConfiguration);
  const orm = Container.get(Orm);
  await orm.init();

  const schema = await buildSchema({
    resolvers: [HelloResolver],
  });
  const service = new ApolloServer({ schema });

  await service.listen(config.port);
};

bootstrap();
