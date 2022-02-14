import { ReportResponseDto } from '../dto/report-response.dto';
import { User } from '../models/user';
import { Service } from 'typedi';
import { Post } from '../models/post';
import { Comment } from '../models/comment';
import { fn, col, literal, Op } from 'sequelize';

@Service()
export class ReportService {
  async makeReport(begin: Date, end: Date): Promise<ReportResponseDto[]> {
    const query = {
      attributes: {
        include: [
          [fn('COUNT', col('posts.id')), 'postCount'] as any,
          [fn('COUNT', col('comments.id')), 'commentCount'] as any,
        ],
      },
      include: [
        {
          model: Post,
          attributes: [],
          where: {
            published_at: {
              [Op.between]: [begin, end],
            },
          },
        },
        {
          model: Comment,
          attributes: [],
          where: {
            published_at: {
              [Op.between]: [begin, end],
            },
          },
        },
      ],
      order: [[literal('(postCount + commentCount) / 10'), 'ASC'] as any],
    };
    const users: any[] = await User.findAll(query);

    return users.map((u) => ({
      nickname: u.nickname,
      email: u.email,
      postCount: u.postCount,
      commentCount: u.commentCount,
    }));
  }
}
