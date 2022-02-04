import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class LoginResponseDto {
  @Field()
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
