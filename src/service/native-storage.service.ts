/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle, BottleMetadata} from '../model/bottle';
import {Observable} from 'rxjs';
import {Image} from '../model/image';
import {FileItem} from './file-item';
import {UploadMetadata} from './image-persistence.service';
import {NotificationService} from './notification.service';
import {NativeStorage} from '@ionic-native/native-storage';
import {User} from '../model/user';
import {Platform} from 'ionic-angular';
import {BottleFactory} from '../model/bottle.factory';
import {Subject} from 'rxjs/Subject';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class NativeStorageService {
  private static BOTTLES_FOLDER = 'bottles';
  private IMAGES_FOLDER = 'images';
  public IMAGES_ROOT: string;
  private USER_ROOT: string;
  private SEP = '/';

  protected USERS_ROOT = 'users';
  protected KNOWN_USERS = this.USERS_ROOT + this.SEP + 'list';
  private BOTTLES_ROOT: string;
  protected XREF_FOLDER = 'xref';
  public XREF_ROOT: string;

  private cordova: boolean = false;

  /**
   * ATTENTION CE SERVICE NE PEUT PAS DEPENDRE DU LOGINSERVICE ! IL EST PROVIDER DE DONNEES POUR LE LOGIN LOCAL ET
   * CELA IMPLIQUERAIT UNE DEPENDANCE CYCLIQUE
   * @param notificationService
   * @param nativeStorage
   */
  constructor(private bottleFactory: BottleFactory, private notificationService: NotificationService,
              private nativeStorage: NativeStorage, private platform: Platform) {
    this.cordova = platform.is('cordova');
  }

  public initialize(user: User) {
    this.IMAGES_ROOT = this.IMAGES_FOLDER;
    this.XREF_ROOT = this.XREF_FOLDER;
    this.USER_ROOT = this.USERS_ROOT + this.SEP + (user ? user.user : '' );
    //this.notificationService.debugAlert('NativeStorage: init avec user.user=' + user.user + ' - USER_ROOT=' +
    // this.USER_ROOT);
    this.BOTTLES_ROOT = this.USER_ROOT + this.SEP + NativeStorageService.BOTTLES_FOLDER;
    this.saveUser(user);
  }

  public cleanup() {
    this.BOTTLES_ROOT = undefined;
    this.IMAGES_ROOT = undefined;
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
    let bottlesSubject: Subject<Bottle[]> = new Subject<Bottle[]>();
    let allBottlesObservable: Observable<Bottle[]> = bottlesSubject.asObservable();

    if (this.cordova) {
      this.nativeStorage.getItem(this.BOTTLES_ROOT)
        .then(
          bottles => {
            //load then prepare loaded bottles for the app
            let btl = bottles.map((bottle: Bottle) => this.bottleFactory.create(bottle));
            bottlesSubject.next(btl);
            bottlesSubject.complete();
          },
          error => {
            //this.notificationService.debugAlert('pas de donnée locale trouvée ' + this.BOTTLES_ROOT, error);
          }
        )
        .catch(error => this.notificationService.debugAlert('(catch) La récupération locale des données a échoué' +
        ' depuis ' + this.BOTTLES_ROOT, error));
    }

    return allBottlesObservable;
  }

  public update(bottles: Bottle[ ]): Promise<any> {
    this.notificationService.warning('Non supporté hors connexion');
    return undefined;
  }

  public save(bottles: Bottle[ ]): Promise<any> {
    if (this.cordova) {
      return this.nativeStorage.setItem(this.BOTTLES_ROOT, bottles)
        .then(
          result => this.notificationService.debugAlert('sauvegarde locale OK'),
          error => this.notificationService.debugAlert('sauvegarde locale En erreur ! ' + error)
        );
    }
  }

  getValue(key: string): any {
    if (this.cordova) {
      return this.nativeStorage.getItem(key);
    } else {
      return undefined
    }
  }

  public replaceBottle(bottle: Bottle) {
    this.notificationService.warning('Non supporté hors connexion');
    return undefined;
  }

  public deleteBottles() {
    this.notificationService.warning('Non supporté hors connexion');
    return undefined;
  }

  private saveUser(user: User) {
    if (user && this.cordova) {
      //this.notificationService.debugAlert('Tentative de sauvegarde de l\'utilisateur: ' + JSON.stringify(user));
      this.getKnownUsers().then(
        (users: User[]) => {
          //this.notificationService.debugAlert('Récupéré ' + JSON.stringify(users.map(u => u.email)));
          users.push(user);
          //this.notificationService.debugAlert('push du user dans le tableau des users OK nb=' +
          // JSON.stringify(users.map(u => u.email)));
          let usersByMail = new Map<string, User>();
          users.forEach((u: User) => {
            if (!usersByMail.has(u.email)) {
              //this.notificationService.debugAlert('le user sera sauvegardé: ' + u.email);
              usersByMail.set(u.email, u);
            } else {
              //this.notificationService.debugAlert('le user ne sera pas sauvegardé: ' + u.email);
            }
          });
          users = Array.from(usersByMail.values());
          //this.notificationService.debugAlert('élim doubles fait. Reste ' + JSON.stringify(users.map(u => u.email)) +
          // '. Sauvegarde...');
          this.nativeStorage.setItem(this.KNOWN_USERS, users);
          //this.notificationService.debugAlert('Sauvegarde liste utilisateurs OK');
        }).catch(err => {
        //this.notificationService.debugAlert('La récupération des utilisateurs locaux a échoué: ', err);
        //this.notificationService.debugAlert('Tentative de sauvegarde de l\'utilisateur: ' + JSON.stringify(user));
        this.nativeStorage.setItem(this.KNOWN_USERS, [ user ])
          .then(value => this.notificationService.debugAlert('sauvegarde apparemment OK ', value))
          .catch(err => this.notificationService.debugAlert('sauvegarde KO ', err));
      });
    }
  }

  getKnownUsers(): Promise<User[ ]> {
    if (this.cordova) {
      return this.nativeStorage.getItem(this.KNOWN_USERS);
    }
    else {
      return this.emptyPromise([]);
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

  deleteKnowUsers() {
    return this.nativeStorage.remove(this.KNOWN_USERS)
      .then(value => this.notificationService.debugAlert('suppression des utilisateurs connus OK'))
      .catch(err => this.notificationService.debugAlert('La suppression des utilisateurs a échoué'));
  }

  getList(): Promise<any> {
    if (this.cordova) {
      return this.nativeStorage.keys();
    } else {
      return this.emptyPromise(undefined);
    }
  }
}


