import {Component} from '@angular/core';
import {Camera} from '@ionic-native/camera';
import {BottleMetadata} from '../../model/bottle';
import {FirebaseImageService, UploadMetadata} from '../../service/firebase-image.service';
import {NotificationService} from '../../service/notification.service';
import {Subscription} from 'rxjs/Subscription';

/**
 * Generated class for the ImageAttacherComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'image-attacher',
             templateUrl: 'image-attacher.html'
           })
export class ImageAttacherComponent {
  progress: number;
  progressSubscription: Subscription;
  private loadingInProgress: boolean = false;

  constructor(private camera: Camera, private imageService: FirebaseImageService, private notificationService: NotificationService) {
    this.progressSubscription = this.imageService.progressEvent.subscribe(
      value => this.progress = value
    );
  }

  captureProfileImage(data: BottleMetadata): Promise<string> {
    let imageSource = this.camera.PictureSourceType.CAMERA;
    this.loadingInProgress = true;
    return new Promise((resolve, reject) => {
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
          return this.imageService.uploadImage(imageBlob, data)
        })
        .then((meta: UploadMetadata) => {
          this.loadingInProgress = false;
          resolve(meta.downloadURL);
        })
        .catch(error => {
          this.loadingInProgress = false;
          reject(error)
        });
    })
  }

// TAKE FROM THE EXISTING PHOTOS
  chooseProfileImage(data: BottleMetadata): Promise<string> {
    let imageSource = this.camera.PictureSourceType.PHOTOLIBRARY;
    this.loadingInProgress = true;
    return new Promise((resolve, reject) => {
      this.camera.getPicture({
                               destinationType: this.camera.DestinationType.FILE_URI,
                               sourceType: imageSource,
                               targetHeight: 800,
                               correctOrientation: true
                             })
        .then((imagePath: UploadMetadata) => this.imageService.createBlobFromPath(imagePath))
        .then((imageBlob: Blob) => {
          // upload the blob
          return this.imageService.uploadImage(imageBlob, data);
        })
        .then((meta: UploadMetadata) => {
          this.loadingInProgress = false;
          resolve(meta.downloadURL);
        })
        .catch(error => {
          this.loadingInProgress = false;
          reject(error);
        });
    })
  }

  readBrowserFile(event: any, data: BottleMetadata) {
    //let textType = /text.*/;
    let file = event.currentTarget.files[ 0 ];
    this.loadingInProgress = true;
    return new Promise((resolve, reject) => {
      this.imageService.uploadImage(file, data)
        .then((meta: UploadMetadata) => {
          this.notificationService.information('L\'image ' + meta.imageName + ' a été correctement enregistrée');
          this.loadingInProgress = false;
          resolve(meta.downloadURL);
        })
        .catch(error => {
                 this.notificationService.error('l\'enregistrement de l\'image a échoué' + error);
                 this.loadingInProgress = false;
                 reject(error);
               }
        );
    })
  }

}
