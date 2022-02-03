import { IsEmail, MaxLength, MinLength } from 'class-validator';
import 'reflect-metadata';
import { ArgsType, Field, InputType } from 'type-graphql';

@InputType()
@ArgsType()
export class UserDto {
  @Field({ nullable: false })
  @MaxLength(255)
  nickname: string;

  @Field({ nullable: false })
  @IsEmail()
  email: string;

  @Field({ nullable: false })
  @MinLength(5)
  @MaxLength(255)
  password: string;
}
