import { MaxLength } from 'class-validator';
import { ArgsType, Field, InputType } from 'type-graphql';

@InputType()
@ArgsType()
export class PostDto {
  @Field({ nullable: false })
  @MaxLength(255)
  title: string;

  @Field({ nullable: false })
  body: string;
}
