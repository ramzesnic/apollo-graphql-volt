import { Query, Resolver } from 'type-graphql';
import { HelloType } from '../types';

@Resolver(HelloType)
export class HelloResolver {
  @Query(() => HelloType)
  sayHello() {
    return new HelloType('1', 'test data');
  }
}
