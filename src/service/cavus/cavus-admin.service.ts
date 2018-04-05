/**
 * Created by loicsalou on 05.04.2018.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import {User} from '../../model/user';
import {SearchCriteria} from '../../model/search-criteria';
import {AdminService} from '../admin.service';

/**
 * Services related to the bottles in the cellar. backend is Cavus.
 */
@Injectable()
export class CavusAdminService implements AdminService {

  constructor() {
  }

  public initialize(user: User) {
    let userRoot = user.user;

    this.initLogging();
  }

  public cleanup() {
  }

  // ===================================================== ERRORS

  public logError(err: any) {
  }

  getMostUsedQueries(nb: number): Observable<SearchCriteria[]> {
    return Observable.of(undefined);
  }

  updateQueryStats(keywords: string[]) {
  }

  removeFromQueryStats(keywords: any) {
  }

  deleteAccount(): Observable<boolean> {
    return Observable.of(true);
  }

  deleteLogs() {
  }

  private initLogging() {
  }
}

