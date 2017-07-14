/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import {Bottle, BottleMetadata} from '../model/bottle';
import {Observable} from 'rxjs';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase/app';
import {Image} from '../model/image';
import {FileItem} from './file-item';
import {UploadMetadata} from './image-persistence.service';
import {NotificationService} from './notification.service';
import {NativeStorage} from '@ionic-native/native-storage';
import {User} from '../model/user';
import * as _ from 'lodash';
import {Platform} from 'ionic-angular';
import Reference = firebase.database.Reference;

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

  protected USERS_ROOT = 'users';
  protected KNOWN_USERS = this.USERS_ROOT + '/list';
  private BOTTLES_ROOT: string;
  protected XREF_FOLDER = 'xref';
  public XREF_ROOT: string;

  private cordova: boolean = false;
  private _bottles: BehaviorSubject<Bottle[]> = new BehaviorSubject<Bottle[]>([]);
  private _allBottlesObservable: Observable<Bottle[]> = this._bottles.asObservable();

  /**
   * ATTENTION CE SERVICE NE PEUT PAS DEPENDRE DU LOGINSERVICE ! IL EST PROVIDER DE DONNEES POUR LE LOGIN LOCAL ET
   * CELA IMPLIQUERAIT UNE DEPENDANCE CYCLIQUE
   * @param notificationService
   * @param nativeStorage
   */
  constructor(private notificationService: NotificationService, private nativeStorage: NativeStorage, private platform: Platform) {
    this.cordova = platform.is('cordova');
  }

  public initialize(user) {
    this.IMAGES_ROOT = this.IMAGES_FOLDER;
    this.XREF_ROOT = this.XREF_FOLDER;
    this.BOTTLES_ROOT = this.USERS_ROOT + '/' + user + '/' + NativeStorageService.BOTTLES_FOLDER;
    this.BOTTLES_ROOT = this.USERS_ROOT + '/' + user + '/' + NativeStorageService.BOTTLES_FOLDER;
  }

  public cleanup() {
    this.BOTTLES_ROOT = undefined;
    this.IMAGES_ROOT = undefined;
    this._bottles.next([]);
  }

  get allBottlesObservable(): Observable<Bottle[ ]> {
    return this._allBottlesObservable;
  }

  public deleteImage(file: File): Promise<any> {
    let item: FileItem = new FileItem(file);
    item.isUploading = true;
    let self = this;
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

  private uploadToStorage(imageBlob, name: string): Promise<any> {
    this.notificationService.warning('Non supporté hors connexion');
    return undefined;
  }

  private saveToDatabaseAssetList(uploadSnapshot, meta: BottleMetadata): Promise<UploadMetadata> {
    this.notificationService.warning('Non supporté hors connexion');
    return undefined;
  }

  private getUploadMeta(snap): UploadMetadata {
    return {
      downloadURL: snap.downloadURL,
      imageName: snap.metadata.name,
      contentType: snap.metadata.contentType,
      totalBytes: snap.totalBytes,
      updated: snap.metadata.updated,
      timeCreated: snap.metadata.timeCreated,
      uploadState: snap.state
    }
  }

  public fetchAllBottles() {
    if (this.cordova) {
      this.nativeStorage.getItem(this.BOTTLES_ROOT)
        .then(
          data => this._bottles.next(JSON.parse(data)),
          error => {
            this.notificationService.error('La récupération locale des données a échoué', error)
          }
        );
    }
  }

  public update(bottles: Bottle[ ]): Promise<any> {
    this.notificationService.warning('Non supporté hors connexion');
    return undefined;
  }

  public save(bottles: Bottle[ ]): Promise<any> {
    if (this.cordova) {
      return this.nativeStorage.setItem(this.BOTTLES_ROOT, JSON.stringify(bottles));
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

  saveUser(user: User) {
    if (this.cordova) {
      this.nativeStorage.getItem(this.KNOWN_USERS).then(
        (users: User[]) => {
          users.push(user);
          users = _.uniqBy(users, function (u: User) {
            return u.email;
          });
          this.nativeStorage.setItem(this.USERS_ROOT, JSON.stringify(users));
        }).catch(err => {
        this.nativeStorage.setItem(this.USERS_ROOT, JSON.stringify([ user ]));
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
}


