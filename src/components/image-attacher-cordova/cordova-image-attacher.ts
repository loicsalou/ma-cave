import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Camera} from '@ionic-native/camera';
import {BottleMetadata} from '../../model/bottle';
import {ImagePersistenceService, UploadMetadata} from '../../service/image-persistence.service';
import {NotificationService} from '../../service/notification.service';
import {Subscription} from 'rxjs';

/**
 * Generated class for the CordovaImageAttacherComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'cordova-image-attacher',
             templateUrl: 'cordova-image-attacher.html'
           })
export class CordovaImageAttacherComponent {
  progress: number;
  progressSubscription: Subscription;
  @Input()
  metadata: BottleMetadata;
  @Output()
  imageUrl: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  error: EventEmitter<any> = new EventEmitter<any>();
  private loadingInProgress: boolean = false;

  constructor(private camera: Camera, private imageService: ImagePersistenceService, private notificationService: NotificationService) {
    this.progressSubscription = this.imageService.progressEvent.subscribe(
      value => this.progress = value,
      error => this.notificationService.error('Erreur d\'upload de l\'image', error),
      () => this.progressSubscription.unsubscribe()
    );
  }

  captureProfileImage(): void {
    let imageSource = this.camera.PictureSourceType.CAMERA;
    this.loadingInProgress = true;

    this.camera.getPicture({
                             destinationType: this.camera.DestinationType.FILE_URI,
                             sourceType: imageSource,
                             targetHeight: 1024,
                             quality: 80,
                             correctOrientation: true
                           })
      .then((imagePath: UploadMetadata) => this.imageService.createBlobFromPath(imagePath))
      .then((imageBlob: Blob) => {
        // upload the blob
        return this.imageService.uploadImage(imageBlob, this.metadata)
      })
      .then((meta: UploadMetadata) => {
        this.loadingInProgress = false;
        this.imageUrl.emit(meta.downloadURL);
      })
      .catch(error => {
        this.loadingInProgress = false;
        this.error.emit(error);
      });
  }

  removeProfileImage(): void {
    this.imageUrl.emit(undefined);
  }

// TAKE FROM THE EXISTING PHOTOS
  chooseProfileImage(): void {
    let imageSource = this.camera.PictureSourceType.PHOTOLIBRARY;
    this.loadingInProgress = true;
    this.camera.getPicture({
                             destinationType: this.camera.DestinationType.FILE_URI,
                             sourceType: imageSource,
                             targetHeight: 800,
                             correctOrientation: true
                           })
      .then((imagePath: UploadMetadata) => this.imageService.createBlobFromPath(imagePath))
      .then((imageBlob: Blob) => {
        // upload the blob
        return this.imageService.uploadImage(imageBlob, this.metadata);
      })
      .then((meta: UploadMetadata) => {
        this.loadingInProgress = false;
        this.imageUrl.emit(meta.downloadURL);
      })
      .catch(error => {
        this.loadingInProgress = false;
        this.error.emit(error);
      });
  }
}
