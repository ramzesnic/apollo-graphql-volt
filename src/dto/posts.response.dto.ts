import { Post } from '../models/post';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PostsResponseDto {
  @Field(() => [Post])
  posts: Partial<Post>[];

  @Field()
  totalPosts: number;

  @Field()
  pages: number;

  @Field()
  isLastPage: boolean;

  constructor(
    posts: Post[],
    totalPosts: number,
    perPage: number,
    currentPage: number,
  ) {
    this.posts = posts;
    this.totalPosts = totalPosts;
    this.pages = Math.trunc(totalPosts / perPage);
    this.isLastPage = currentPage === this.pages;
  }
}
