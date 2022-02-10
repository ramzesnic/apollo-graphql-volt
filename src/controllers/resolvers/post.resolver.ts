import { Post } from '../../models/post';
import { Service } from 'typedi';
import { Arg, Args, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import { PostService } from '../../services/post.service';
import { PostsResponseDto } from '../../dto/posts.response.dto';
import { GraphQLResolveInfo } from 'graphql';
import { fieldsList, fieldsMap } from 'graphql-fields-list';
import { PostDto } from '../../dto/post.dto';
import { IContext } from '../../interfaces/icontext';

@Service()
@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => PostsResponseDto)
  getPosts(
    @Arg('page') currentPage: number,
    @Arg('per_page') perPage: number,
    @Info() info: GraphQLResolveInfo,
  ): Promise<PostsResponseDto> {
    const { posts } = fieldsMap(info);
    const fields = Object.keys(posts);
    return this.postService.getPosts(currentPage, perPage, fields);
  }

  @Query(() => Post)
  getPost(
    @Arg('id') id: number,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Partial<Post>> {
    const fields = fieldsList(info);
    return this.postService.getPost(id, fields);
  }

  @Mutation(() => Post)
  createPost(
    @Args() data: PostDto,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: IContext,
  ): Promise<Partial<Post>> {
    const fields = fieldsList(info);
    const userId = ctx.user.id;
    return this.postService.createPost(data, userId, fields);
  }

  @Mutation(() => Post)
  updatePost(
    @Arg('id') id: number,
    @Args() data: PostDto,
    @Info() info: GraphQLResolveInfo,
  ) {
    const fields = fieldsList(info);
    return this.postService.updatePost(id, data, fields);
  }

  @Mutation(() => Post)
  deletePost(@Arg('id') id: number, @Info() info: GraphQLResolveInfo) {
    const fields = fieldsList(info);
    return this.postService.deletePost(id, fields);
  }
}
