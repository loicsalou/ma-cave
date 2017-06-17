import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Bottle} from '../../model/bottle';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {BottleService} from '../../service/bottle-firebase.service';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {FirebaseImageService} from '../../service/firebase-image.service';
import {Subscription} from 'rxjs/Subscription';

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
  images: Array<{ src: String }> = [];
  private imagesSubscription: Subscription;

  constructor(private navCtrl: NavController, private navParams: NavParams, private bottleService: BottleService,
              private camera: Camera, private alertController: AlertController, private imageService: FirebaseImageService) {
    this.bottle = navParams.data[ 'bottle' ];
  }

  ngOnInit(): void {
    let imagesObservable = this.imageService.getList(this.bottle);
    this.imagesSubscription = imagesObservable.subscribe(
      images => this.images = images.map(
        image => {
          return {src: 'data:image/jpeg;base64,' + image}
        }
      )
    );
    this.navCtrl.viewWillLeave.subscribe(() => this.imagesSubscription.unsubscribe());
  }

  save() {
    this.bottleService.save([ this.bottle ]);
  }

  public takePhoto() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: false
    }
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI if it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.images.unshift({src: base64Image});
      this.imageService.add(base64Image, this.bottle);
    }, (err) => {
      this.presentAlert('L\'image n\'a pas pu être récupérée !', err);
    });
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
