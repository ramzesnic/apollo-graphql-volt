import { ArgsType, Field, InputType } from 'type-graphql';

@InputType()
@ArgsType()
export class PostPaginateDto {
  @Field({ nullable: false })
  page: number;

  @Field({ nullable: false })
  per_page: number;
}
