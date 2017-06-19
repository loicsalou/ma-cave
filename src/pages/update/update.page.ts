import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Bottle} from '../../model/bottle';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {BottleService} from '../../service/bottle-firebase.service';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {FirebaseImageService} from '../../service/firebase-image.service';
import {Subscription} from 'rxjs/Subscription';
import * as firebase from 'firebase/app';

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

  constructor(private navCtrl: NavController, private navParams: NavParams, private bottleService: BottleService,
              private camera: Camera, private alertController: AlertController, private imageService: FirebaseImageService) {
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

  public takePhoto(sourceType: number) {
    //L'option allowedit est imprévisible sur android, cf doc cordova
    // https://github.com/apache/cordova-plugin-camera#cameraoptions-errata-
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      allowEdit: true,
      targetHeight: 500,
      targetWidth: 500,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    }
    this.camera.getPicture(options).then((imageUri) => {
      // imageData is either a base64 encoded string or a file URI if it's base64:
      this.images.unshift({src: imageUri});
      this.imageService.uploadImagesToFirebase(imageUri);
    }, (err) => {
      this.presentAlert('L\'image n\'a pas pu être récupérée !', err);
    });
  }

  readBrowserFile(event: any) {
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

}
