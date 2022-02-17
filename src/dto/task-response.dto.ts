import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class TaskResponse {
  @Field()
  message: string;
}
