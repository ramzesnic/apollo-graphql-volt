import 'reflect-metadata';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Comment } from './comment';
import { User } from './user';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Scopes(() => ({
  withAuthor: {
    include: [User],
  },
}))
@Table({ tableName: 'posts' })
export class Post extends Model {
  @Field(() => ID)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field()
  @Column(DataTypes.CHAR)
  title: string;

  @Field()
  @Column(DataTypes.TEXT)
  body: string;

  @ForeignKey(() => User)
  @Column
  authorId: number;

  @Field(() => User)
  @BelongsTo(() => User)
  author: User;

  @Field(() => [Comment])
  @HasMany(() => Comment)
  comments: Comment[];

  @Field()
  @CreatedAt
  published_at: Date;
}
