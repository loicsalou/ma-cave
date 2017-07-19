/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {AbstractLoginService} from './abstract-login.service';
import {User} from '../model/user';
import {Observable} from 'rxjs/Observable';
import {NotificationService} from './notification.service';
import {NativeStorageService} from './native-storage.service';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class LocalLoginService extends AbstractLoginService {

  private _localUser: User;
  knownUsers: User[];

  constructor(notificationService: NotificationService, private storageService: NativeStorageService) {
    super(notificationService);
    this.storageService.getKnownUsers().then(
      (users:User[]) => this.knownUsers=users
    )
  }

  set localUser(value: any) {
    this._localUser = new LocalLoginUser(value._user, value._email, value._photoUrl, value._displayName, value._uid, value._phoneNumber);
    this.notificationService.debugAlert('localLogin, set localUser(value) appelé, résultat : '+JSON.stringify(this._localUser));
  }

  public login(): Observable<User> {
    //async this, must return first
    setTimeout(() => this.success(this._localUser), 300);
    return this.authentifiedObservable;
  }
}


export class LocalLoginUser extends User {

  constructor(user: string, email: string, photoURL: string, displayName: string, uid: string, phoneNumber: string) {
    super();
    this.user = email.replace(/[\.]/g, '');
    this.user = this.user.replace(/[#.]/g, '');
    this.email = email;
    this.photoURL = photoURL;
    this.uid = uid;
    this.phoneNumber = phoneNumber;
    this.displayName = displayName;
  }

}
