import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Bottle} from '../../model/bottle';
import {AlertController, NavController, NavParams, Platform} from 'ionic-angular';
import {BottleService} from '../../service/bottle-firebase.service';
import {Camera} from '@ionic-native/camera';
import {FirebaseImageService} from '../../service/firebase-image.service';
import {Subscription} from 'rxjs/Subscription';
import * as firebase from 'firebase/app';
import {File as CordovaFile} from '@ionic-native/file';

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

  constructor(private navCtrl: NavController, private navParams: NavParams, private bottleService: BottleService,
              private camera: Camera, private alertController: AlertController, private cordovaFile: CordovaFile,
              private imageService: FirebaseImageService, private platform: Platform) {
    this.bottle = navParams.data[ 'bottle' ];
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
        console.info(this.images.length + ' images trouvées');
      }
    );
    this.navCtrl.viewWillLeave.subscribe(() => this.imagesSubscription.unsubscribe());
  }

  save() {
    this.bottleService.save([ this.bottle ]);
  }

  public platformIsCordova(): boolean {
    return this.platform.is('cordova');
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
    this.imageService.uploadImage(file);
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

  //PHOTO
  doGetPictureFromCamera() {
    //let imageSource = (Device.isVirtual ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA);
    //console.log(Device)
    let imageSource = this.camera.PictureSourceType.CAMERA;
    this.camera.getPicture({
                             destinationType: this.camera.DestinationType.FILE_URI,
                             sourceType: imageSource,
                             targetHeight: 640,
                             correctOrientation: true
                           })
      .then(imagePath => this.imageService.uploadPhoto(imagePath));
  }

  doGetPictureFromGallery() {
    //let imageSource = (Device.isVirtual ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA);
    //console.log(Device)
    let imageSource = this.camera.PictureSourceType.PHOTOLIBRARY;
    this.camera.getPicture({
                             destinationType: this.camera.DestinationType.FILE_URI,
                             sourceType: imageSource,
                             targetHeight: 640,
                             correctOrientation: true
                           })
      .then(imagePath => this.imageService.uploadPhoto(imagePath));
  }

}
