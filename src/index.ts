import * as dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import Container from 'typedi';
import { AppConfiguration } from './config';
import { HelloResolver } from './controllers/resolvers';
import { Orm } from './orm';
import { User } from './models/user';
import { Post } from './models/post';
import { Comment } from './models/comment';

const bootstrap = async () => {
  dotenv.config();
  const config = Container.get(AppConfiguration);
  const orm = Container.get(Orm);

  const sequelize = await orm.init();

  Container.set('userRepository', sequelize.getRepository(User));
  Container.set('postRepository', sequelize.getRepository(Post));
  Container.set('commentRepository', sequelize.getRepository(Comment));

  const schema = await buildSchema({
    resolvers: [HelloResolver],
    container: Container,
  });
  const service = new ApolloServer({ schema });

  await service.listen(config.port);
};

bootstrap();
