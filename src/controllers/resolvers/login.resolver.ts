import { Service } from 'typedi';
import { Args, Query, Resolver } from 'type-graphql';
import { AuthService } from '../../services/auth.service';
import { LoginResponseDto } from '../../dto/login.response.dto';
import { LoginDto } from '../../dto/login.dto';

@Service()
@Resolver()
export class LoginResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => LoginResponseDto)
  login(@Args() data: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = data;
    return this.authService.login(email, password);
  }
}
