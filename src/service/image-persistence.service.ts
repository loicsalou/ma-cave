/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import 'firebase/storage';
import {Bottle} from '../model/bottle';
import {AbstractPersistenceService} from './abstract-persistence.service';
import {Observable, Subject, of} from 'rxjs';
import {Image} from '../model/image';
import {NotificationService} from './notification.service';
import {TranslateService} from '@ngx-translate/core';
import {FirebaseImagesService} from './firebase/firebase-images.service';
import {Store} from '@ngrx/store';
import {ApplicationState} from '../app/state/app.state';
import {BottleMetadata} from '../model/bottle-metadata';

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class ImagePersistenceService extends AbstractPersistenceService {

  private _progressEvent: Subject<number> = new Subject<number>();
  private progressEvent$: Observable<number>;

  constructor(private firebaseImageService: FirebaseImagesService,
              notificationService: NotificationService, translateService: TranslateService,
              store: Store<ApplicationState>) {
    super(notificationService, translateService, store);
    this.subscribeLogin();
  }

  /**
   * permet de suivre la progression des uploads.
   * @returns {Observable<number>}
   */
  get progressEvent(): Observable<number> {
    return this.firebaseImageService.progress();
  }

  /**
   * liste des images d'une bouteille
   * @param bottle
   */
  public getList(bottle: Bottle): Observable<Image[]> {
    if (!bottle) {
      return of([]);
    }
    return this.firebaseImageService.listBottleImages(bottle);
  }

  public deleteImage(file: File) {
    let self = this;
    this.firebaseImageService.deleteImage(file)
      .then(function () {
              self.notificationService.information('Image supprimée !');
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
      return this.firebaseImageService.uploadFileOrBlob(image, meta);
    } else {
      this.notificationService.warning('impossible d\'uploader l\'image dont le type est ' + typeof image + ' !');
    }
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
