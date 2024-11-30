import { DatabaseType } from '@/utils/config';

export default interface Answers {
  database: DatabaseType;
  serviceFile: boolean;
  apiRoutes: boolean;
}
