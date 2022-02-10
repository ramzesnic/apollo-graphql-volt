import { Service } from 'typedi';
import { Arg, Args, Ctx, Info, Mutation, Resolver } from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import { fieldsList } from 'graphql-fields-list';
import { CommentService } from '../../services/comment.service';
import { CommentDto } from '../../dto/comment.dto';
import { Comment } from '../../models/comment';
import { IContext } from '../../interfaces/icontext';

@Service()
@Resolver(Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Mutation(() => Comment)
  createComment(
    @Arg('postId') postId: number,
    @Args() data: CommentDto,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: IContext,
  ) {
    const fields = fieldsList(info);
    const userId = ctx.user.id;
    return this.commentService.createComment(data, postId, userId, fields);
  }

  @Mutation(() => Comment)
  updateComment(
    @Arg('id') id: number,
    @Args() data: CommentDto,
    @Info() info: GraphQLResolveInfo,
  ) {
    const fields = fieldsList(info);
    return this.commentService.updateComment(id, data, fields);
  }

  @Mutation(() => Comment)
  deleteComment(@Arg('id') id: number, @Info() info: GraphQLResolveInfo) {
    const fields = fieldsList(info);
    return this.commentService.deleteComment(id, fields);
  }
}
