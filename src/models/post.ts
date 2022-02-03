import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Comment } from './comment';
import { User } from './user';

@Table({ tableName: 'posts' })
export class Post extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataTypes.CHAR)
  title: string;

  @Column(DataTypes.TEXT)
  body: string;

  @BelongsTo(() => User, { foreignKey: 'id', onDelete: 'CASCADE' })
  author: User;

  @HasMany(() => Comment, 'postId')
  comments: Comment[];

  @CreatedAt
  published_at: Date;
}
