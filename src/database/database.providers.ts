import { DATA_SOURCE } from '../constants';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      let database: string;
      switch (process.env.NODE_ENV) {
        case 'development':
          database = 'db.sqlite';
          break;
        case 'test':
          database = 'test.sqlite';
          break;
        default:
          throw new Error('Unrecognised environment');
      }

      const dataSource = new DataSource({
        type: 'sqlite',
        database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
