import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { DatabaseModule } from '../database/database.module';
import { reportProviders } from './report.providers';

@Module({
  controllers: [ReportsController],
  providers: [...reportProviders, ReportsService],
  imports: [DatabaseModule],
})
export class ReportsModule {}
