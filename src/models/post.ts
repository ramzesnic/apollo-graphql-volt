import 'reflect-metadata';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
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

  @Field(() => User)
  @BelongsTo(() => User, { foreignKey: 'id', onDelete: 'CASCADE' })
  author: User;

  @Field(() => [Comment])
  @HasMany(() => Comment, 'postId')
  comments: Comment[];

  @Field()
  @CreatedAt
  published_at: Date;
}
