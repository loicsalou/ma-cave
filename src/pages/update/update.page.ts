import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Bottle, BottleMetadata} from '../../model/bottle';
import {NavController, NavParams} from 'ionic-angular';
import {BottleService} from '../../service/firebase-bottle.service';
import {Camera} from '@ionic-native/camera';
import {FirebaseImageService, UploadMetadata} from '../../service/firebase-image.service';
import {Subscription} from 'rxjs/Subscription';
import {AocInfo, Bottles} from '../../components/config/Bottles';
import {LoginService} from '../../service/login.service';
import {NotificationService} from '../../service/notification.service';
import * as _ from 'lodash';

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
export class UpdatePage implements OnInit, OnDestroy {

  bottle: Bottle;
  images: Array<{ src: String }> = [];
  private imagesSubscription: Subscription;
  private aoc: AocInfo[];
  unchanged = false;
  loadingInProgress: boolean = false;
  progress: number = 0;
  private missingImages: string[] = [];
  private progressSubscription: Subscription;
  private forceLeave: boolean = true;
  private metadata: BottleMetadata;

  constructor(private navCtrl: NavController, navParams: NavParams, private bottleService: BottleService,
              private camera: Camera, private notificationService: NotificationService, private imageService: FirebaseImageService,
              private loginService: LoginService, private bottles: Bottles) {
    //don't clone to keep firebase '$key' which is necessary to update
    this.bottle = navParams.data[ 'bottle' ];
    this.metadata = Bottle.getMetadata(this.bottle);
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }

  cleanupSubscriptions(): void {
    this.imagesSubscription.unsubscribe();
    this.progressSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadRegionAreas();
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
    this.progressSubscription = this.imageService.progressEvent.subscribe(
      value => this.progress = value
    );
  }

  ionViewCanLeave() {
    if (!this.forceLeave) {
      return new Promise((resolve, reject) => {
        this.notificationService.ask('Confirmation', 'Attention, les changements faits seront perdus')
          .subscribe(
            response => resolve(response),
            error => reject(error)
          );
      });
    }
  }

  ionViewDidLeave() {
    this.cleanupSubscriptions();
  }

  logout() {
    this.forceLeave = true; // évite l'avertissement lors du changement d'écran puisqu'on est de toute façon déloggé
    this.loginService.logout();
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
    this.navCtrl.pop();
  }

  // =============================
  // IMAGE AVAILABILITY MANAGEMENT
  imageIsAvailable(url: string): boolean {
    return _.indexOf(this.missingImages, url) === -1;
  }

  declareMissingImage(event) {
    //console.info(event.currentTarget.src);
    this.missingImages.push(event.currentTarget.src);
  }

  // =============
  // PROFILE IMAGE
  setProfileImage(downloadURL: string) {
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

  error(error) {
    this.notificationService.error('Erreur lors de l\'upload !', error);
  }
}
