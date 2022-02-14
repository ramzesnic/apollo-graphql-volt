import { IsDateString, IsEmail } from 'class-validator';
import { ArgsType, Field, InputType } from 'type-graphql';

@InputType()
@ArgsType()
export class ReportDto {
  @Field({ nullable: false })
  @IsDateString()
  start_date: string;

  @Field({ nullable: false })
  @IsDateString()
  end_date: string;

  @Field({ nullable: false })
  @IsEmail()
  email: string;
}
