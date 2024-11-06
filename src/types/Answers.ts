import { DatabaseType } from './DatabaseType';

export default interface Answers {
  database: DatabaseType;
  serviceFile: boolean;
  apiRoutes: boolean;
}
