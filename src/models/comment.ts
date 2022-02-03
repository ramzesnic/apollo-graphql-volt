import 'reflect-metadata';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
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

  @Field(() => User)
  @BelongsTo(() => User, { foreignKey: 'id', onDelete: 'CASCADE' })
  author: User;

  @Field(() => Post)
  @BelongsTo(() => Post, { foreignKey: 'id', onDelete: 'CASCADE' })
  post: Post;

  @Field()
  @CreatedAt
  published_at: Date;
}
