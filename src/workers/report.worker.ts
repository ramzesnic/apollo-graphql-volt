import { Job } from 'bull';
import { Orm } from '../orm';
import { MailService } from '../services/mail.service';
import { ReportService } from '../services/report.service';
import Container from 'typedi';
import { ReportDto } from '../dto/report.dto';
import { ReportRenderUtil } from '../utils/report-render.util';

const configureApp = async (): Promise<void> => {
  const orm = Container.get(Orm);
  const sequelize = await orm.init();
  Container.set('sequelize', sequelize);
};
configureApp().then(() => {
  console.log('Worker init');
});

const reportService = Container.get(ReportService);
const mailService = Container.get(MailService);

export default async (job: Job) => {
  const data: ReportDto = job.data;
  const { start_date, end_date, email: to } = data;
  const begin = new Date(start_date);
  const end = new Date(end_date);

  const report = await reportService.makeReport(begin, end);
  const body = ReportRenderUtil.plainRender(report);

  return mailService.send(to, body);
};
