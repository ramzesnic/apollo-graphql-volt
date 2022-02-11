import 'reflect-metadata';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Post } from './post';
import { User } from './user';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Table({ tableName: 'comments' })
export class Comment extends Model {
  @Field(() => ID)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field()
  @Column(DataTypes.TEXT)
  body: string;

  @ForeignKey(() => User)
  @Column
  authorId: number;

  @Field(() => User)
  @BelongsTo(() => User)
  author: User;

  @ForeignKey(() => Post)
  @Column
  postId: number;

  @Field(() => Post)
  @BelongsTo(() => Post)
  post: Post;

  @Field()
  @CreatedAt
  published_at: Date;
}
