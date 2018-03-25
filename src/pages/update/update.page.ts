import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Bottle, BottleMetadata} from '../../model/bottle';
import {NavController, NavParams} from 'ionic-angular';
import {BottlePersistenceService} from '../../service/bottle-persistence.service';
import {ImagePersistenceService} from '../../service/image-persistence.service';
import {AocInfo, Bottles} from '../../config/Bottles';
import {NotificationService} from '../../service/notification.service';
import * as _ from 'lodash';
import {Configuration} from '../../config/Configuration';
import {NgForm} from '@angular/forms';

/*
 Generated class for the Update component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@Component({
             selector: 'update',
             templateUrl: 'update.page.html',
             styleUrls: [ '/update.page.scss' ],
             // warning: few browsers support shadow DOM encapsulation at this time
             encapsulation: ViewEncapsulation.Emulated
           })
export class UpdatePage implements OnInit {

  bottle: Bottle;
  images: Array<{ src: String }> = [];
  progress: number = 0;
  @ViewChild('bottleForm') bottleForm: NgForm;
  private aoc: AocInfo[];
  private missingImages: string[] = [];
  private forceLeave: boolean = true;
  private metadata: BottleMetadata;

  constructor(private navCtrl: NavController, navParams: NavParams, private bottleService: BottlePersistenceService,
              private notificationService: NotificationService, private imageService: ImagePersistenceService,
              private bottles: Bottles) {
    //don't clone to keep firebase '$key' which is necessary to update
    this.bottle = navParams.data[ 'bottle' ];
    this.metadata = Configuration.getMetadata(this.bottle);
  }

  ngOnInit(): void {
    this.loadRegionAreas();
    this.imageService.getList(this.bottle).take(1).subscribe(
      images => {
        this.images = images.map(
          image => {
            return {src: image.image}
          }
        );
      }
    );
    this.imageService.progressEvent.subscribe(
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

  loadRegionAreas() {
    this.aoc = undefined;
    let aocs = this.bottles.aocByArea.filter(area => area.key === this.bottle.subregion_label);
    if (aocs && aocs.length > 0) {
      this.aoc = aocs[ 0 ].value;
    }
  }

  /**
   * l'utilisateur a choisi une appellation (en fait sa search string), qui se trouve maintenannt dans
   * metadata.area_label_search il faut donc à partir de metadata.area_label_search retrouver le area_label qui
   * correspond dans les AOC et modifier la bouteille pour renseigner la nouvelle appellation.
   */
  setAreaLabelFromMetadata() {
    let chosenAoc: AocInfo[] = this.aoc.filter(anAoc => anAoc.appellationSearched === this.metadata.area_label_search);
    if (chosenAoc && chosenAoc.length === 1) {
      this.bottle.area_label = chosenAoc[ 0 ].appellation;
    } else {
      let nb = chosenAoc ? chosenAoc.length : 0;
      this.notificationService.warning('Mise à jour de l\'appellation impossible: ' + nb + ' appellations trouvées');
    }
  }

  save() {
    this.bottleService.update([ this.bottle ]);
    this.notificationService.information('update.saved');
    this.navCtrl.pop();
  }

  cancel() {
    this.notificationService.information('update.cancelled');
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
    this.bottle.profile_image_url = downloadURL ? downloadURL : '';
    if (!this.bottle.image_urls) {
      this.bottle.image_urls = []
    }
    this.bottle.image_urls.push(downloadURL);
  }

  getProfileImage() {
    return this.bottle.profile_image_url;
  }

  error(error) {
    this.notificationService.error('Erreur lors de l\'upload !', error);
  }
}
