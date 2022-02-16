import { ReportResponseDto } from '../dto/report-response.dto';
import { User } from '../models/user';
import { Inject, Service } from 'typedi';
import { Sequelize } from 'sequelize';

@Service()
export class ReportService {
  @Inject('sequelize')
  private sequelize: Sequelize;

  async makeReport(begin: Date, end: Date): Promise<ReportResponseDto[]> {
    const query = `
SELECT nickname, email, COUNT(posts.id) AS postCount, COUNT(comments.id) AS commentCount, ((CAST(COUNT(posts.id) AS REAL) + CAST(COUNT(comments.id) AS REAL))/10) AS total
FROM users
LEFT JOIN posts AS posts ON users.id = posts.authorId AND posts.published_at BETWEEN :begin AND :end
LEFT JOIN comments AS comments ON users.id = comments.authorId AND posts.published_at BETWEEN :begin AND :end
GROUP BY users.nickname
ORDER BY total;
    `;
    const users: any[] = await this.sequelize.query(query, {
      replacements: { begin, end },
      model: User,
      mapToModel: true,
    });
    //console.log(users);

    return users.map((u) => ({
      nickname: u.nickname,
      email: u.email,
      postCount: u.dataValues.postCount,
      commentCount: u.dataValues.commentCount,
    }));
  }
}
