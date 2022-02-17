import { AppConfiguration } from '../config';
import { Service } from 'typedi';
import Queue from 'bull';
import path from 'path';
import { ReportDto } from '../dto/report.dto';

@Service()
export class TaskService {
  private queue: Queue.Queue<ReportDto>;

  constructor(private readonly config: AppConfiguration) {
    this.queue = new Queue('create report');
    this.queue.process(
      config.workers,
      path.resolve(__dirname, '../../dist/src/workers/report.worker.js'),
    );
  }

  createTask(data: ReportDto): void {
    this.queue.add(data);
    this.queue.on('error', (error) => {
      console.log('===============BULL ERROR=================');
      console.log(error);
    });
  }
}
