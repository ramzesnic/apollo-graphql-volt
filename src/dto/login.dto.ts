import { ArgsType, Field, InputType } from 'type-graphql';

@InputType()
@ArgsType()
export class LoginDto {
  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  password: string;
}
