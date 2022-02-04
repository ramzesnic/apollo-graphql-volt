import { ArgsType, Field, InputType } from 'type-graphql';

@InputType()
@ArgsType()
export class CommentDto {
  @Field({ nullable: false })
  body: string;
}
