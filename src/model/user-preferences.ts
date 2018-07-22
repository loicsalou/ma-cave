import {SearchCriteria} from './search-criteria';
import {BOTTLE_ITEM_TYPE} from '../app/state/shared.state';

export interface UserPreferences {
  theme?: string;
  itemType?: BOTTLE_ITEM_TYPE;
  mostUsedQueries?: SearchCriteria[];
}
