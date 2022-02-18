import { Job } from 'bull';
import { Orm } from '../orm';
import { MailService } from '../services/mail.service';
import { ReportService } from '../services/report.service';
import Container from 'typedi';
import { ReportDto } from '../dto/report.dto';
import { ReportRenderUtil } from '../utils/report-render.util';
import { User } from '../models/user';
import { Sequelize } from 'sequelize';
import { AppConfiguration } from '../config';

export default async (job: Job) => {
  const query = `
SELECT nickname, email, COALESCE(p.cnt, 0) AS "postCount", COALESCE(c.cnt, 0) AS "commentCount",
((CAST(COALESCE(p.cnt, 0) AS REAL) + CAST(COALESCE(c.cnt, 0) AS REAL))/10) AS total
FROM users AS u
LEFT JOIN (
  SELECT "authorId", COUNT(*) AS cnt
  FROM posts
  WHERE posts.published_at BETWEEN :begin AND :end
  GROUP BY "authorId"
) p ON u.id = p."authorId"
LEFT JOIN (
  SELECT "authorId", COUNT(*) AS cnt
  FROM comments
  WHERE comments.published_at BETWEEN :begin AND :end
  GROUP BY "authorId"
) c ON u.id = c."authorId"
ORDER BY total ASC
;
    `;
  let sequelize: Sequelize;
  const getReport = async (begin: Date, end: Date) => {
    const users: any[] = await sequelize.query(query, {
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
  };

  const configureApp = async (): Promise<void> => {
    console.log('===============worker================');
    const orm = new Orm(new AppConfiguration());
    sequelize = await orm.init();
  };
  await configureApp()
    .then(() => {
      console.log('Worker init');
    })
    .catch((e) => {
      console.log(e);
    });

  //Container.set('sequelize', sequelize);
  //const reportService = Container.get(ReportService);
  //const mailService = Container.get(MailService);

  console.log('===============worker job================');
  const data: ReportDto = job.data;
  const { start_date, end_date, email: to } = data;
  const begin = new Date(start_date);
  const end = new Date(end_date);

  const report = await getReport(begin, end);
  console.log(report);

  //const report = await reportService.makeReport(begin, end);
  //const body = ReportRenderUtil.plainRender(report);

  //return mailService.send(to, body);
};
