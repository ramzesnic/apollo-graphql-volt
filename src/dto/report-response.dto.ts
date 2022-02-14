import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ReportResponseDto {
  @Field()
  email: string;

  @Field()
  nickname: string;

  @Field()
  postCount: number;

  @Field()
  commentCount: number;
}
