import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Bottle} from '../../model/bottle';
import {AlertController, NavController, NavParams, Platform} from 'ionic-angular';
import {BottleService} from '../../service/firebase-bottle.service';
import {Camera} from '@ionic-native/camera';
import {FirebaseImageService, UploadMetadata} from '../../service/firebase-image.service';
import {Subscription} from 'rxjs/Subscription';
import * as firebase from 'firebase/app';
import {AocInfo, Bottles} from '../../components/config/Bottles';

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

  constructor(private navCtrl: NavController, private navParams: NavParams, private bottleService: BottleService,
              private camera: Camera, private alertController: AlertController, private imageService: FirebaseImageService,
              private platform: Platform, private bottles: Bottles) {
    //don't clone to keep firebase key which is necessary to update
    this.bottle = navParams.data[ 'bottle' ];
    this.loadRegionAreas();
  }

  debug() {
    console.info(JSON.stringify(this.bottle));
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

  loadImage() {
    let promise: firebase.Promise<any> = this.imageService.getImage('20170415_174618.jpg');
    promise.then(
      url => {
        console.info('URL resstituée: ' + url);
        this.imgUrl = url;
      }
    ).catch(
      err => console.error('erreur d\'accès à l\'url' + err)
    );
  }

  readBrowserFile(event: any) {
    this.imageService.tracer.subscribe(
      message => this.traces.push(message)
    );

    //let textType = /text.*/;
    let file = event.currentTarget.files[ 0 ];
    this.imageService.uploadImage(file, Bottle.getMetadata(this.bottle))
      .then((meta: UploadMetadata) => {
        this.presentAlert(meta.uploadState, 'L\'image ' + meta.imageName + ' a été uploadée avec l\'URL ' + meta.downloadURL + ' le ' + meta.updated);
        this.setProfileImage(meta.downloadURL);

      })
      .catch(err => this.presentAlert('Erreur !', 'l\'upload a échoué' + err));
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
    //let imageSource = (Device.isVirtual ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA);
    //console.log(Device)
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
      .catch(err => this.presentAlert('Erreur !', 'l\'upload a échoué' + err));
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
      .catch(err => this.presentAlert('Erreur !', 'l\'upload a échoué' + err));
  }

  private presentAlert(title: string, text: string) {
    let alert = this.alertController.create({
                                              title: title,
                                              subTitle: text,
                                              buttons: [ 'Ok' ]
                                            }
    );
    alert.present();
  }
}
