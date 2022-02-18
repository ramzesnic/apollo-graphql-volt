import { AppConfiguration } from '../config';
import { Service } from 'typedi';
import Queue from 'bull';
import path from 'path';
import { ReportDto } from '../dto/report.dto';

@Service()
export class TaskService {
  private queue: Queue.Queue<ReportDto>;

  constructor(private readonly config: AppConfiguration) {
    const { workers, redisUrl, env } = config;
    const devWorkerPath = '../../dist/workers/report.worker.js';
    const prodWorkerPath = '../../src/workers/report.worker.js';
    const workerPath = env === 'production' ? prodWorkerPath : devWorkerPath;
    this.queue = new Queue('create report', redisUrl);
    this.queue.process(5, path.resolve(__dirname, workerPath));
  }

  createTask(data: ReportDto): void {
    this.queue
      .add(data)
      .then(() => {
        console.log('job added');
      })
      .catch((e) => {
        console.log('job fail');
        console.log(e.message);
      });
    this.queue.on('error', (error) => {
      console.log('===============BULL ERROR=================');
      console.log(error);
    });
    this.queue.on('completed', (data) => {
      console.log('===============BULL COMPLETED=================');
      console.log('completed');
    });
    this.queue.on('progress', () => {
      console.log('===============BULL PROGRESS=================');
      console.log('progress');
    });
    this.queue.on('failed', (error) => {
      console.log('===============BULL FAILED=================');
      console.log(error);
    });
  }
}
