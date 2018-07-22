import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {
  DeleteAccountAction,
  LoadSharedAction,
  LoadSharedSuccessAction,
  LoginAction,
  LoginSuccessAction,
  LogoutAction,
  SharedActionTypes,
  UpdateMostUsedQueriesAction,
  UpdatePrefsAction
} from './shared.actions';
import {SharedPersistenceService} from '../../service/shared-persistence.service';
import {UserPreferences} from '../../model/user-preferences';
import {LoginService} from '../../service/login/login.service';
import {User} from '../../model/user';
import {logInfo} from '../../utils';
import {throwError} from 'rxjs';
import {NavController} from 'ionic-angular';

@Injectable()
export class SharedEffectsService {

  @Effect() login$ = this.actions$
    .ofType(SharedActionTypes.LoginActionType).pipe(
      switchMap((action: LoginAction) =>
                  this.loginService.login(action.loginType, action.user, action.password)
      ),
      map((user: User) => new LoginSuccessAction(user))
    );

  @Effect({dispatch: false}) loginSuccess$ = this.actions$
    .ofType(SharedActionTypes.LoginActionSuccessType).pipe(
      tap((action: LoginSuccessAction) => {
            logInfo('LoginSuccessAction');
          }
      )
    );

  @Effect({dispatch: false}) logoutAction$ = this.actions$
    .ofType(SharedActionTypes.LogoutActionType).pipe(
      tap((action: LogoutAction) => {
            this.loginService.logout();
            //if (!HomePage.loggedIn) {
            //  this.navCtrl.setRoot(HomePage);
            //  this.navCtrl.popToRoot();
              setTimeout(() => {
                           window.history.pushState({}, '', '/');
                           window.location.reload();
                         }
                , 100);
            }
          //}
      )
    );

  @Effect() getShared$ = this.actions$
    .ofType(SharedActionTypes.LoadSharedActionType).pipe(
      switchMap(() =>
                  this.sharedServices.getUserPreferences()),
      map((prefs: UserPreferences) =>
            new LoadSharedSuccessAction(prefs))
    );

  @Effect() updatePrefs$ = this.actions$
    .ofType(SharedActionTypes.UpdatePrefsActionType).pipe(
      tap((action: UpdatePrefsAction) => this.sharedServices.updatePrefs(action.theme, action.itemType)),
      map(() => new LoadSharedAction())
    );

  @Effect({dispatch: false}) updateQueries$ = this.actions$
    .ofType(SharedActionTypes.UpdateMostUsedQueriesActionType).pipe(
      tap((action: UpdateMostUsedQueriesAction) => this.sharedServices.updateQueryStats(action.keywords))
    );

  @Effect({dispatch: false}) deleteAccount$ = this.actions$
    .ofType(SharedActionTypes.DeleteAccountActionType).pipe(
      tap((action: DeleteAccountAction) => this.withdrawalsService.deleteAccountData().subscribe(
        result => throwError('Delete account not implemented !')
          )
      )
    );

  constructor(private actions$: Actions, private withdrawalsService: BottlePersistenceService,
              private sharedServices: SharedPersistenceService, private loginService: LoginService) {
  }

}
