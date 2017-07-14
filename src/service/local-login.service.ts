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

  localUser: User;
  knownUsers: User[];

  constructor(notificationService: NotificationService, private storageService: NativeStorageService) {
    super(notificationService);
    this.storageService.getKnownUsers().then(
      (users:User[]) => this.knownUsers=users
    )
  }

  public login(): Observable<User> {
    //async this, must return first
    setTimeout(() => this.success(this.localUser), 300);
    return this.authentifiedObservable;
  }
}

