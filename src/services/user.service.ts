import { UserDto } from '../dto/user.dto';
import { User } from '../models/user';
import { Service } from 'typedi';

@Service()
export class UserService {
  private makeUserData(data: UserDto): Partial<User> {
    return {
      nickname: data.nickname,
      email: data.email,
      password: data.password,
    };
  }
  async getUsers(attributes: string[]): Promise<Partial<User>[]> {
    return User.findAll({ attributes });
  }

  async getUser(id: number, attributes: string[]): Promise<Partial<User>> {
    return User.findByPk(id, { attributes });
  }

  async createUser(data: UserDto, fields: string[]): Promise<Partial<User>> {
    const user = User.build(this.makeUserData(data));
    return user.save({ fields });
  }

  async updateUser(
    id: number,
    data: UserDto,
    attributes: string[],
  ): Promise<Partial<User>> {
    const user = await User.findByPk(id, { attributes });
    if (!user) {
      throw new Error('User not found');
    }
    user.nickname = data.nickname;
    user.email = data.email;
    user.password = data.password;
    return user.save();
  }

  async deleteUser(id: number, attributes: string[]): Promise<Partial<User>> {
    const user = await User.findByPk(id, { attributes });
    await user.destroy();
    return user;
  }
}
