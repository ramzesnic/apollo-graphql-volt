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

@Table({ tableName: 'comments' })
export class Comment extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column(DataTypes.TEXT)
  body: string;

  @BelongsTo(() => User, { foreignKey: 'id', onDelete: 'CASCADE' })
  author: User;

  @BelongsTo(() => Post, { foreignKey: 'id', onDelete: 'CASCADE' })
  post: Post;

  @CreatedAt
  published_at: Date;
}
