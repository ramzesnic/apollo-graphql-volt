import {
  AutoIncrement,
  BeforeSave,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { Post } from './post';
import { DataTypes } from 'sequelize';
import { Comment } from './comment';

@Table({ tableName: 'users' })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({ unique: true, type: DataTypes.CHAR })
  nickname: string;

  @Column({ unique: true, type: DataTypes.CHAR })
  email: string;

  @Column(DataTypes.CHAR)
  password: string;

  @HasMany(() => Post, 'authorId')
  posts: Post[];

  @HasMany(() => Comment, 'authorId')
  comments: Comment[];

  @BeforeSave
  static async hashPassword(user: User): Promise<void> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    user.password = bcrypt.hashSync(user.password, salt);
  }
}
