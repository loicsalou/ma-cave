import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Bottle} from '../../model/bottle';
import {NavController, NavParams} from 'ionic-angular';
import {BottleService} from '../../service/firebase-bottle.service';
import {Camera} from '@ionic-native/camera';
import {FirebaseImageService, UploadMetadata} from '../../service/firebase-image.service';
import {Subscription} from 'rxjs/Subscription';
import {AocInfo, Bottles} from '../../components/config/Bottles';
import {LoginService} from '../../service/login.service';
import {HomePage} from '../home/home';
import {NotificationService} from '../../service/notification.service';

/*
 Generated class for the Update component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
             selector: 'update',
             templateUrl: '/update.page.html',
             styleUrls: [ '/update.page.scss' ],
             // warning: few browsers support shadow DOM encapsulation at this time
             encapsulation: ViewEncapsulation.Emulated
           })
export class UpdatePage implements OnInit {

  bottle: Bottle;
  imgUrl: string;
  images: Array<{ src: String }> = [];
  private imagesSubscription: Subscription;
  private traces: string[] = [];
  private aoc: AocInfo[];
  unchanged = false;

  constructor(private navCtrl: NavController, navParams: NavParams, private bottleService: BottleService,
              private camera: Camera, private notificationService: NotificationService, private imageService: FirebaseImageService,
              private loginService: LoginService, private bottles: Bottles) {
    //don't clone to keep firebase key which is necessary to update
    this.bottle = navParams.data[ 'bottle' ];
    this.loadRegionAreas();
  }

  ngOnInit(): void {
    let imagesObservable = this.imageService.getList(this.bottle);
    this.imagesSubscription = imagesObservable.subscribe(
      images => {
        this.images = images.map(
          image => {
            return {src: image.image}
          }
        );
      }
    );
    this.navCtrl.viewWillLeave.subscribe(() => this.imagesSubscription.unsubscribe());
  }

  logout() {
    this.loginService.logout();
    this.navCtrl.push(HomePage);
  }

  loadRegionAreas() {
    this.aoc = undefined;
    let aocs = this.bottles.aocByArea.filter(area => area.key === this.bottle.subregion_label);
    if (aocs && aocs.length > 0) {
      this.aoc = aocs[ 0 ].value;
    }
  }

  save() {
    this.bottleService.update([ this.bottle ]);
  }

  cancel() {
    this.notificationService.ask('Confirmation', 'Attention, les changements faits seront perdus').subscribe(
      result => {
        if (result) {
          this.cancel()
        }
      }
    )
  }

  readBrowserFile(event: any) {
    this.imageService.tracer.subscribe(
      message => this.traces.push(message)
    );

    //let textType = /text.*/;
    let file = event.currentTarget.files[ 0 ];
    this.imageService.uploadImage(file, Bottle.getMetadata(this.bottle))
      .then((meta: UploadMetadata) => {
        this.notificationService.information('L\'image ' + meta.imageName + ' a été correctement enregistrée');
        this.setProfileImage(meta.downloadURL);

      })
      .catch(error => this.notificationService.error('l\'enregistrement de l\'image a échoué' + error));
  }

  private setProfileImage(downloadURL: string) {
    this.bottle.profile_image_url = downloadURL;
    if (!this.bottle.image_urls) {
      this.bottle.image_urls = []
    }
    this.bottle.image_urls.push(downloadURL);
  }

  getProfileImage() {
    return this.bottle.profile_image_url;
  }

  removeProfileImage() {
    this.bottle.profile_image_url = '';
  }

  // PHOTO CAPTURED DIRECTLY BA THE CAMERA
  captureProfileImage() {
    let imageSource = this.camera.PictureSourceType.CAMERA;
    this.camera.getPicture({
                             destinationType: this.camera.DestinationType.FILE_URI,
                             sourceType: imageSource,
                             targetHeight: 800,
                             correctOrientation: true
                           })
      .then((imagePath: UploadMetadata) => this.imageService.createBlobFromPath(imagePath))
      .then((imageBlob: Blob) => {
        // upload the blob
        return this.imageService.uploadImage(imageBlob, Bottle.getMetadata(this.bottle));
      })
      .then((meta: UploadMetadata) => {
        this.setProfileImage(meta.downloadURL);
      })
      .catch(error => this.notificationService.error('l\'enregistrement de l\'image a échoué' + error));
  }

  // TAKE FROM THE EXISTING PHOTOS
  chooseProfileImage() {
    let imageSource = this.camera.PictureSourceType.PHOTOLIBRARY;
    this.camera.getPicture({
                             destinationType: this.camera.DestinationType.FILE_URI,
                             sourceType: imageSource,
                             targetHeight: 800,
                             correctOrientation: true
                           })
      .then((imagePath: UploadMetadata) => this.imageService.createBlobFromPath(imagePath))
      .then((imageBlob: Blob) => {
        // upload the blob
        return this.imageService.uploadImage(imageBlob, Bottle.getMetadata(this.bottle));
      })
      .then((meta: UploadMetadata) => {
        this.setProfileImage(meta.downloadURL);
      })
      .catch(error => this.notificationService.error('l\'enregistrement de l\'image a échoué' + error));
  }
}
