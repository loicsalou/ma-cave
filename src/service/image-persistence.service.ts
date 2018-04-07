/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import 'firebase/storage';
import {LoginService} from './login/login.service';
import {Bottle, BottleMetadata} from '../model/bottle';
import {AbstractPersistenceService} from './abstract-persistence.service';
import {Observable} from 'rxjs/Observable';
import {Image} from '../model/image';
import {NotificationService} from './notification.service';
import {Subject} from 'rxjs/Subject';
import {FirebaseAdminService} from './firebase/firebase-admin.service';
import {TranslateService} from '@ngx-translate/core';
import {FirebaseImagesService} from './firebase/firebase-images.service';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class ImagePersistenceService extends AbstractPersistenceService {

  constructor(private firebaseImageService: FirebaseImagesService,
              notificationService: NotificationService, translateService: TranslateService, loginService: LoginService) {
    super(notificationService, loginService, translateService);
    if (loginService.user !== undefined) {
      this.initialize(loginService.user);
    } else {
      this.cleanup();
    }
  }

  private _progressEvent: Subject<number> = new Subject<number>();

  private progressEvent$: Observable<number> = this._progressEvent.asObservable();

  get progressEvent(): Observable<number> {
    return this.progressEvent$;
  }

  /**
   * liste des images d'une bouteille
   * @param bottle
   */
  public getList(bottle: Bottle): Observable<Image[]> {
    let items = new Observable<Image[]>();
    if (!bottle) {
      return items;
    }
    items = this.firebaseImageService.listBottleImages(bottle);
    items.subscribe(
      (images: Image[]) => this.notificationService.traceInfo(images.length + ' images reçues'),
      error => this.handleError('liste des images disponibles', error)
    );

    return items;
  }

  public deleteImage(file: File) {
    let self = this;
    this.firebaseImageService.deleteImage(file)
      .then(function () {
              self.notificationService.information('Image supprimée !')
            }
      )
      .catch(function (error) {
        self.notificationService.error('L\'image n\'a pas pu être supprimée ! ', error);
      });

  }

  /**
   * upload a picture and push to firebase
   * @param image either an image (instanceof File) or an image on a mobile phone (actually something like an URI
   * that must be translated to Blob before being uploaded)
   * @param meta metadata to be attached to the image in Firebase
   */
  public uploadImage(image: File | any, meta: BottleMetadata): Promise<void | UploadMetadata> {
    if (image instanceof Blob || image instanceof File) {
      return this.firebaseImageService.uploadFileOrBlob(image, meta)
    } else {
      this.notificationService.warning('impossible d\'uploader l\'image dont le type est ' + typeof image + ' !');
    }
  }

  public createBlobFromPath(imagePath): Promise<Blob> {
    // REQUIRED PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      (<any>window).resolveLocalFileSystemURL(imagePath, (fileEntry) => {
        fileEntry.file(
          (resFile) => {
            let reader = new FileReader();
            reader.onloadend = (evt: any) => {
              let imgBlob: any = new Blob([ evt.target.result ], {type: 'image/jpeg'});
              imgBlob.name = 'blob.jpg';
              resolve(imgBlob);
            };

            reader.onerror = (error) => {
              this.notificationService.error('La création du BLOB à partir du fichier a échoué: ', error);
              reject(error);
            };

            reader.readAsArrayBuffer(resFile);
          },
          (error) => this.notificationService.error('La résolution du nom local du fichier choisi a échoué', error));
      });
    });
  }

  protected initialize(user) {
    super.initialize(user);
  }

  protected cleanup() {
    super.cleanup();
  }
}

export interface UploadMetadata {
  downloadURL: string;
  imageName: string;
  contentType: string;
  totalBytes: number;
  updated: string;
  timeCreated: string;
  uploadState: string;
}
