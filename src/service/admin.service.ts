import {SearchCriteria} from '../model/search-criteria';
import {Observable} from 'rxjs/Rx';
import {User} from '../model/user';
import {Injectable} from '@angular/core';

@Injectable()
export abstract class AdminService {

  abstract initialize(user: User);

  abstract cleanup();

  abstract updateQueryStats(keywords: string[]);

  abstract removeFromQueryStats(keywords: any);

  abstract deleteAccount(): Observable<boolean>;

  abstract deleteLogs();
}
