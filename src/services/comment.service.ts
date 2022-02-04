import { CommentDto } from '../dto/comment.dto';
import { Comment } from '../models/comment';
import { Post } from '../models/post';
import { User } from '../models/user';
import { ModelUtil } from '../utils/model.util';
import { Service } from 'typedi';

@Service()
export class CommentService {
  private static COMMENT_RELATION = {
    author: User,
    post: Post,
  };
  private makeCommentData(
    data: CommentDto,
    post: Post,
    author: User,
  ): Partial<Comment> {
    const { body } = data;
    return { body, post, author };
  }

  async createComment(
    data: CommentDto,
    postId: number,
    userId: number,
    fields: string[],
  ): Promise<Partial<Comment>> {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw Error('Post not found');
    }
    const author = await User.findByPk(userId);
    if (!author) {
      throw Error('User not found');
    }
    const comment = Comment.build(this.makeCommentData(data, post, author));

    return comment.save({ fields });
  }

  async updateComment(
    id: number,
    data: CommentDto,
    fields: string[],
  ): Promise<Partial<Comment>> {
    const attributes = ModelUtil.makeAttributes(
      fields,
      CommentService.COMMENT_RELATION,
    );
    const relations = ModelUtil.makeRelations(
      fields,
      CommentService.COMMENT_RELATION,
    );

    const comment = await Comment.findByPk(id, {
      attributes,
      include: relations,
    });
    if (!comment) {
      throw new Error('Comment not found');
    }

    comment.body = data.body;
    return comment.save();
  }

  async deleteComment(id: number, fields: string[]): Promise<Partial<Comment>> {
    const attributes = ModelUtil.makeAttributes(
      fields,
      CommentService.COMMENT_RELATION,
    );
    const relations = ModelUtil.makeRelations(
      fields,
      CommentService.COMMENT_RELATION,
    );

    const comment = await Comment.findByPk(id, {
      attributes,
      include: relations,
    });
    if (!comment) {
      throw new Error('Comment not found');
    }
    await comment.destroy();

    return comment;
  }
}
