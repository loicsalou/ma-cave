import {SearchCriteria} from './search-criteria';

export interface UserPreferences {
  theme?: string;
  mostUsedQueries?: SearchCriteria[];
}
