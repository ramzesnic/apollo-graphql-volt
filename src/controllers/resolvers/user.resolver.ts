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
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { fieldsList } from 'graphql-fields-list';
import { UserDto } from '../../dto/user.dto';
import { AppConfiguration } from '../../config';

@Service()
@Resolver(User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly config: AppConfiguration,
  ) {}

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

  @Mutation(() => User)
  //@Authorized()
  setAvatar(
    @Arg('id') id: number,
    @Arg('file', () => GraphQLUpload) file: FileUpload,
  ): Promise<Partial<User>> {
    const { createReadStream, filename } = file;
    const ext = filename.split('.').pop();
    const { allowFileTypes } = this.config.imageConfig;
    if (!allowFileTypes.includes(ext)) {
      throw Error('File type is not allowed');
    }
    return this.userService.addAvatar(id, filename, createReadStream());
  }
}
