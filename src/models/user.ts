import 'reflect-metadata';
import {
  AutoIncrement,
  BeforeSave,
  Column,
  DefaultScope,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import { Post } from './post';
import { DataTypes } from 'sequelize';
import { Comment } from './comment';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@DefaultScope(() => ({
  attributes: ['id', 'nickname', 'email', 'password'],
}))
@Scopes(() => ({
  withPosts: {
    include: [Post],
  },
}))
@Table({ tableName: 'users' })
export class User extends Model {
  @Field(() => ID)
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Field()
  @Column({ unique: true, type: DataTypes.STRING })
  nickname: string;

  @Field()
  @Column({ unique: true, type: DataTypes.STRING })
  email: string;

  @Field()
  @Column(DataTypes.STRING)
  password: string;

  @Field()
  @Column(DataTypes.STRING)
  avatar: string;

  @Field(() => [Post])
  @HasMany(() => Post, { onDelete: 'RESTRICT' })
  posts: Post[];

  @Field(() => [Comment])
  @HasMany(() => Comment, { onDelete: 'RESTRICT' })
  comments: Comment[];

  @BeforeSave
  static async hashPassword(user: User): Promise<void> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    user.password = bcrypt.hashSync(user.password, salt);
    //console.log(user);
  }

  async comparePassword(password: string): Promise<boolean> {
    try {
      return bcrypt.compare(password, this.password);
    } catch {
      return false;
    }
  }
}
