import { ReportResponseDto } from '../dto/report-response.dto';
import { User } from '../models/user';
import { Inject, Service } from 'typedi';
import { Sequelize } from 'sequelize';

@Service()
export class ReportService {
  @Inject('sequelize')
  private sequelize: Sequelize;

  async makeReport(begin: Date, end: Date): Promise<ReportResponseDto[]> {
    //const query = `
    //SELECT nickname, email, COUNT(p.id) AS postCount, COUNT(c.id) AS commentCount, ((CAST(COUNT(p.id) AS REAL) + CAST(COUNT(c.id) AS REAL))/10) AS total
    //FROM users AS u
    //LEFT JOIN posts AS p ON u.id = p.authorId AND p.published_at BETWEEN :begin AND :end
    //LEFT JOIN comments AS c ON u.id = c.authorId AND c.published_at BETWEEN :begin AND :end
    //GROUP BY u.nickname
    //ORDER BY total;
    //`;
    const query = `
SELECT nickname, email, p.cnt AS postCount, c.cnt AS commentCount,
((CAST(p.cnt AS REAL) + CAST(c.cnt AS REAL))/10) AS total
FROM users AS u
LEFT JOIN (
  SELECT authorId, COUNT(*) AS cnt
  FROM posts
  WHERE posts.published_at BETWEEN :begin AND :end
  GROUP BY authorId
) p ON u.id = p.authorId
LEFT JOIN (
  SELECT authorId, COUNT(*) AS cnt
  FROM comments
  WHERE comments.published_at BETWEEN :begin AND :end
  GROUP BY authorId
) c ON u.id = c.authorId
;
    `;
    const users: any[] = await this.sequelize.query(query, {
      replacements: { begin, end },
      model: User,
      mapToModel: true,
    });
    console.log(users);

    return users.map((u) => ({
      nickname: u.nickname,
      email: u.email,
      postCount: u.dataValues.postCount,
      commentCount: u.dataValues.commentCount,
    }));
  }
}
