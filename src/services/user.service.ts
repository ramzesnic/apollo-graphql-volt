import { UserDto } from '../dto/user.dto';
import { User } from '../models/user';
import { Service } from 'typedi';
import { Post } from '../models/post';
import { Comment } from '../models/comment';
import { ModelUtil } from '../utils/model.util';

@Service()
export class UserService {
  private static USER_RELATION = {
    posts: Post,
    comments: Comment,
  };

  private makeUserData(data: UserDto): Partial<User> {
    const { nickname, email, password } = data;
    return {
      nickname,
      email,
      password,
    };
  }

  async getUsers(fields: string[]): Promise<Partial<User>[]> {
    const attributes = ModelUtil.makeAttributes(
      fields,
      UserService.USER_RELATION,
    );
    const relations = ModelUtil.makeRelations(
      fields,
      UserService.USER_RELATION,
    );

    return User.findAll({ attributes, include: relations });
  }

  async getUser(id: number, fields: string[]): Promise<Partial<User>> {
    const attributes = ModelUtil.makeAttributes(
      fields,
      UserService.USER_RELATION,
    );
    const relations = ModelUtil.makeRelations(
      fields,
      UserService.USER_RELATION,
    );
    return User.findByPk(id, { attributes, include: relations });
  }

  async createUser(data: UserDto, fields: string[]): Promise<Partial<User>> {
    const user = User.build(this.makeUserData(data));
    return user.save({ fields });
  }

  async updateUser(
    id: number,
    data: UserDto,
    fields: string[],
  ): Promise<Partial<User>> {
    const attributes = ModelUtil.makeAttributes(
      fields,
      UserService.USER_RELATION,
    );
    const relations = ModelUtil.makeRelations(
      fields,
      UserService.USER_RELATION,
    );
    const user = await User.findByPk(id, { attributes, include: relations });
    if (!user) {
      throw new Error('User not found');
    }
    user.nickname = data.nickname;
    user.email = data.email;
    user.password = data.password;
    return user.save();
  }

  async deleteUser(id: number, fields: string[]): Promise<Partial<User>> {
    const attributes = ModelUtil.makeAttributes(
      fields,
      UserService.USER_RELATION,
    );
    const relations = ModelUtil.makeRelations(
      fields,
      UserService.USER_RELATION,
    );
    const user = await User.findByPk(id, { attributes, include: relations });
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
    return user;
  }
}
