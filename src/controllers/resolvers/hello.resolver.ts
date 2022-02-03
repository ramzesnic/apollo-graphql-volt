import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { HelloType } from '../types';

@Service()
@Resolver(HelloType)
export class HelloResolver {
  @Query(() => HelloType)
  sayHello() {
    return new HelloType('1', 'test data');
  }
}
