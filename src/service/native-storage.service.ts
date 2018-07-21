
import {of as observableOf, Observable, Subject} from 'rxjs';
/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle, BottleMetadata} from '../model/bottle';
import {Image} from '../model/image';
import {FileItem} from '../model/file-item';
import {UploadMetadata} from './image-persistence.service';
import {NotificationService} from './notification.service';
import {User} from '../model/user';
import {Platform} from 'ionic-angular';
import {BottleFactory} from '../model/bottle.factory';

import * as schema from './firebase/firebase-schema';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class NativeStorageService {
  private USER_ROOT: string;
  private SEP = '/';
  protected KNOWN_USERS = schema.USERS_FOLDER + this.SEP + 'list';
  private BOTTLES_ROOT: string;
  private bottlesSubject: Subject<Bottle[]>;
  private bottlesObservable: Observable<Bottle[]>;

  private cordova: boolean = false;

  /**
   * ATTENTION CE SERVICE NE PEUT PAS DEPENDRE DU LOGINSERVICE ! IL EST PROVIDER DE DONNEES POUR LE LOGIN LOCAL ET
   * CELA IMPLIQUERAIT UNE DEPENDANCE CYCLIQUE
   * @param notificationService
   * @param nativeStorage
   */
  constructor(private bottleFactory: BottleFactory, private notificationService: NotificationService,
              private platform: Platform) {
    this.cordova = platform.is('cordova');
  }

  public initialize(user: User) {
    this.USER_ROOT = schema.USERS_FOLDER + this.SEP + (user ? user.user : '');
    this.BOTTLES_ROOT = this.USER_ROOT + this.SEP + schema.BOTTLES_FOLDER;
    this.bottlesSubject = new Subject();
    this.bottlesObservable = this.bottlesSubject.asObservable();
    this.saveUser(user);
  }

  public cleanup() {
    this.BOTTLES_ROOT = undefined;
  }

  public deleteImage(file: File): Promise<any> {
    let item: FileItem = new FileItem(file);
    item.isUploading = true;
    return new Promise<any>((resolve, reject) => {
                              let error = undefined;
                              let result = 'ok';
                              if (error) {
                                reject(error);
                              }
                              if (result) {
                                resolve(result);
                              }
                            }
    );
  }

  public uploadImageToStorage(imageBlob, name: string): Promise<any> {
    return this.emptyPromise(undefined);
  }

  public listBottleImages(bottle: Bottle): Observable<Image[]> {
    this.notificationService.warning('Non supporté hors connexion');
    return undefined;
  }

  public uploadFileOrBlob(fileOrBlob, meta: BottleMetadata): Promise<void | UploadMetadata> {
    this.notificationService.warning('Non supporté hors connexion');
    return undefined;
  }

  public fetchAllBottles(): Observable<Bottle[]> {
    if (this.cordova) {
    } else {
      this.bottlesObservable = observableOf(<Bottle[]>[]);
    }

    return this.bottlesObservable;
  }

  public save(bottles: Bottle[ ]) {
    if (this.cordova) {
    }
  }

  public getValue(key: string): any {
    if (this.cordova) {
    } else {
      return undefined;
    }
  }

  public getKnownUsers(): Promise<User[ ]> {
    if (this.cordova) {
    }
    else {
      return this.emptyPromise([]);
    }
  }

  public deleteKnowUsers() {
  }

  public getList(): Promise<any> {
    if (this.cordova) {
    } else {
      return this.emptyPromise(undefined);
    }
  }

  //
  //public replaceBottle(bottle: Bottle) {
  //  this.notificationService.warning('Non supporté hors connexion');
  //  return undefined;
  //}
  //
  //public deleteBottles() {
  //  this.notificationService.warning('Non supporté hors connexion');
  //  return undefined;
  //}

  private saveUser(user: User) {
    if (user && this.cordova) {
      this.getKnownUsers().then(
        (users: User[]) => {
          users.push(user);
          let usersByMail = new Map<string, User>();
          users.forEach((u: User) => {
            if (!usersByMail.has(u.email)) {
              usersByMail.set(u.email, u);
            }
          });
          users = Array.from(usersByMail.values());
        }).catch(err => {
      });
    }
  }

  private emptyPromise(returnedData): Promise<any> {
    return new Promise<any>(
      (resolve, reject) => {
        let error = undefined;
        let result = 'ok';
        if (error) {
          reject(error);
        }
        if (result) {
          resolve(returnedData);
        }
      }
    );
  }
}


