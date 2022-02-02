import 'reflect-metadata';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class HelloType {
  @Field(() => ID)
  id: string;

  @Field()
  data: string;

  constructor(id: string, data: string) {
    this.id = id;
    this.data = data;
  }
}
