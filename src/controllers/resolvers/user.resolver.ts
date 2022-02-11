import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import {
  Arg,
  Args,
  Authorized,
  Info,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { Service } from 'typedi';
import { GraphQLResolveInfo } from 'graphql';
import { fieldsList } from 'graphql-fields-list';
import { UserDto } from '../../dto/user.dto';

@Service()
@Resolver(User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  @Authorized()
  getUsers(@Info() info: GraphQLResolveInfo): Promise<Partial<User>[]> {
    const fields = fieldsList(info);
    return this.userService.getUsers(fields);
  }

  @Query(() => User)
  @Authorized()
  getUser(
    @Arg('id') id: number,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Partial<User>> {
    const fields = fieldsList(info);
    return this.userService.getUser(id, fields);
  }

  @Mutation(() => User)
  //@Authorized()
  createUser(
    @Args() data: UserDto,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Partial<User>> {
    const fields = fieldsList(info);
    return this.userService.createUser(data, fields);
  }

  @Mutation(() => User)
  @Authorized()
  updateUser(
    @Arg('id') id: number,
    @Args() data: UserDto,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Partial<User>> {
    const fields = fieldsList(info);
    return this.userService.updateUser(id, data, fields);
  }

  @Mutation(() => User)
  @Authorized()
  deleteUser(
    @Arg('id') id: number,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Partial<User>> {
    const fields = fieldsList(info);
    return this.userService.deleteUser(id, fields);
  }
}
