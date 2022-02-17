import { ReportResponseDto } from '../dto/report-response.dto';
import Table from 'easy-table';

export class ReportRenderUtil {
  static plainRender(report: ReportResponseDto[]): string {
    return Table.print(report);
  }
}
