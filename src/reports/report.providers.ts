import { DataSource } from 'typeorm';
import { Report } from './report.entity';
import { DATA_SOURCE, REPORT_REPOSITORY } from '../constants';

export const reportProviders = [
  {
    provide: REPORT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Report),
    inject: [DATA_SOURCE],
  },
];
