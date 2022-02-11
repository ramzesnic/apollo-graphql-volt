import { LoginResponseDto } from '../dto/login.response.dto';
import { User } from '../models/user';
import { Service } from 'typedi';
import * as jwt from 'jsonwebtoken';
import { AppConfiguration } from '../config';

@Service()
export class AuthService {
  constructor(private readonly config: AppConfiguration) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      throw Error('Incorrect email or password');
    }

    const payload = {
      id: user.id,
    };

    const token = jwt.sign(payload, this.config.secret, {
      expiresIn: this.config.jwtExpires,
    });

    return new LoginResponseDto(token);
  }
}
