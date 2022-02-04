import { User } from '../models/user';
import { Service } from 'typedi';
import { Comment } from '../models/comment';
import { ModelUtil } from '../utils/model.util';
import { PostsResponseDto } from '../dto/posts.response.dto';
import { Post } from '../models/post';
import { PostDto } from '../dto/post.dto';

@Service()
export class PostService {
  private static POST_RELATION = {
    author: User,
    comments: Comment,
  };

  private makePostData(data: PostDto, author: User): Partial<Post> {
    const { title, body } = data;
    return {
      title,
      body,
      author,
    };
  }

  async getPosts(
    currentPage: number,
    perPage: number,
    fields: string[],
  ): Promise<PostsResponseDto> {
    const attributes = ModelUtil.makeAttributes(
      fields,
      PostService.POST_RELATION,
    );
    const relations = ModelUtil.makeRelations(
      fields,
      PostService.POST_RELATION,
    );

    const { rows: posts, count } = await Post.findAndCountAll({
      attributes,
      include: relations,
      limit: perPage,
      offset: perPage * (currentPage - 1),
      order: [['published_at', 'DESC']],
    });

    return new PostsResponseDto(posts, count, perPage, currentPage);
  }

  async getPost(id: number, fields: string[]): Promise<Partial<Post>> {
    const attributes = ModelUtil.makeAttributes(
      fields,
      PostService.POST_RELATION,
    );
    const relations = ModelUtil.makeRelations(
      fields,
      PostService.POST_RELATION,
    );

    return Post.findByPk(id, { attributes, include: relations });
  }

  async createPost(data: PostDto, userId: number, fields: string[]) {
    const author = await User.findByPk(userId);
    if (!author) {
      throw Error('User not found');
    }
    const post = Post.build(this.makePostData(data, author));

    return post.save({ fields });
  }

  async updatePost(
    id: number,
    data: PostDto,
    fields: string[],
  ): Promise<Partial<Post>> {
    const attributes = ModelUtil.makeAttributes(
      fields,
      PostService.POST_RELATION,
    );
    const relations = ModelUtil.makeRelations(
      fields,
      PostService.POST_RELATION,
    );

    const post = await Post.findByPk(id, { attributes, include: relations });
    if (!post) {
      throw new Error('Post not found');
    }

    post.title = data.title;
    post.body = data.body;
    return post.save();
  }

  async deletePost(id: number, fields: string[]): Promise<Partial<Post>> {
    const attributes = ModelUtil.makeAttributes(
      fields,
      PostService.POST_RELATION,
    );
    const relations = ModelUtil.makeRelations(
      fields,
      PostService.POST_RELATION,
    );

    const post = await Post.findByPk(id, { attributes, include: relations });
    if (!post) {
      throw new Error('Post not found');
    }
    await post.destroy();
    return post;
  }
}
