import { Service } from 'typedi';
import { Args, Authorized, Query, Resolver } from 'type-graphql';
import { TaskService } from '../../services/task.service';
import { TaskResponse } from '../../dto/task-response.dto';
import { ReportDto } from '../../dto/report.dto';

@Service()
@Resolver(TaskResponse)
export class ReportResolver {
  constructor(private readonly taskService: TaskService) {}

  @Query(() => TaskResponse)
  //@Authorized()
  createReport(@Args() data: ReportDto): TaskResponse {
    this.taskService.createTask(data);
    return {
      message: 'Report generation started',
    };
  }
}
