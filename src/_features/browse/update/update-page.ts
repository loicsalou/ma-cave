import {Component, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Bottle, BottleMetadata} from '../../../model/bottle';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ImagePersistenceService} from '../../../service/image-persistence.service';
import {NotificationService} from '../../../service/notification.service';
import * as _ from 'lodash';
import {NgForm} from '@angular/forms';
import {AocInfo} from '../../../config/aoc-info';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Image} from '../../../model/image';
import {ApplicationState} from '../../../app/state/app.state';
import {Store} from '@ngrx/store';
import {UpdateBottlesAction} from '../../../app/state/bottles.actions';
import {isMobileDevice} from '../../../utils';

/*
 Generated class for the Update component.

 See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 for more info on Angular 2 Components.
 */
@IonicPage()
@Component({
             selector: 'update',
             templateUrl: 'update-page.html',
             // styleUrls:[ 'update-page.scss' ],
             // warning: few browsers support shadow DOM encapsulation at this time
             encapsulation: ViewEncapsulation.Emulated
           })
export class UpdatePage implements OnInit {
  private static SEARCH_STRING_REMOVED_CHARS = new RegExp(/[\ |\-|\.|\d|\n|\r|,|!|?|@]/g);
  private static SPECIAL_CHARS_REMOVED = new RegExp(/[\.|\d|\n|\r|,|!|?|@]/g);

  bottle: Bottle;
  image$: Observable<{ src: string }[]>;
  aocData: any[];
  colorsData: any[];

  @ViewChild('bottleForm') bottleForm: NgForm;

  private aoc: AocInfo[];
  private missingImages: string[] = [];
  private forceLeave: boolean = true;
  private metadata: BottleMetadata;
  private mobile: boolean = false;

  constructor(private navCtrl: NavController, navParams: NavParams, private store: Store<ApplicationState>,
              private notificationService: NotificationService, private imageService: ImagePersistenceService,
              @Inject('GLOBAL_CONFIG') public config) {
    //don't clone to keep firebase '$key' which is necessary to update
    this.aocData = this.initAoc(this.config.bottles.aocData);
    this.colorsData = Object.keys(this.config.bottles.colorsData).map(
      (key: string) => {
        return {key: key, value: this.config.bottles.colorsData[ key ]};
      }
    );
    // input bottle is immutable ==> clone
    this.bottle = new Bottle(navParams.data[ 'bottle' ]);
    this.metadata = UpdatePage.getMetadata(this.bottle);
    this.mobile = isMobileDevice();
  }

  /**
   * get the search string corresponding to the given text.
   * Basically this means the same string, as lowercase, from which all special chars have been removed.
   * @param text
   */
  public static getSearchStringFor(text: string): string {
    if (text) {
      return text.toLowerCase().replace(UpdatePage.SEARCH_STRING_REMOVED_CHARS, '');
    }
    return text;
  }

  public static getMetadata(bottle: any): BottleMetadata {
    let keywords = [];
    keywords.push(UpdatePage.extractKeywords(bottle.area_label));
    keywords.push(UpdatePage.extractKeywords(bottle.label));
    keywords.push(UpdatePage.extractKeywords(bottle.subregion_label));
    keywords = _.uniq(_.flatten(keywords));

    let secondaryKeywords = [];
    secondaryKeywords.push(UpdatePage.extractKeywords(bottle.comment));
    secondaryKeywords.push(UpdatePage.extractKeywords(bottle.suggestion));

    return {
      area_label: bottle.area_label,
      area_label_search: UpdatePage.getSearchStringFor(bottle.area_label),
      nomCru: bottle.nomCru,
      subregion_label: bottle.subregion_label,
      keywords: keywords,
      secondaryKeywords: secondaryKeywords
    };
  }

  private static extractKeywords(text: string): string[] {
    if (text) {
      let ret = text.replace(UpdatePage.SPECIAL_CHARS_REMOVED, ' ');
      return ret
        .split(' ')
        .filter(keyword => keyword.length > 2)
        .map(keyword => keyword.toLowerCase());
    } else {
      return [];
    }
  }

  ngOnInit(): void {
    this.loadRegionAreas();
    this.image$ = this.imageService.getList(this.bottle).pipe(
      map((images: Image[]) => images.filter((image: Image) => image.nomCru === this.bottle.nomCru)),
      map((images: Image[]) =>
            images.map(image => {
                         return {src: image.URL};
                       }
            )
      )
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
    let aocs = this.config.bottles.aocData[ this.bottle.subregion_label ];
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

  // =============================

  save() {
    this.store.dispatch(new UpdateBottlesAction([ this.bottle ]));
    this.notificationService.information('update.saved');
    this.navCtrl.pop();
  }

  cancel() {
    this.notificationService.information('update.cancelled');
    this.navCtrl.pop();
  }

  // =============

  // IMAGE AVAILABILITY MANAGEMENT
  imageIsAvailable(url: string): boolean {
    return _.indexOf(this.missingImages, url) === -1;
  }

  declareMissingImage(event) {
    this.missingImages.push(event.currentTarget.src);
  }

  // PROFILE IMAGE
  setProfileImage(downloadURL: string) {
    this.bottle.profile_image_url = downloadURL ? downloadURL : '';
    if (!this.bottle.image_urls) {
      this.bottle.image_urls = [];
    }
    this.bottle.image_urls=[...this.bottle.image_urls, downloadURL];
    this.store.dispatch(new UpdateBottlesAction([ this.bottle ]));
  }

  // private

  getProfileImage() {
    return this.bottle.profile_image_url;
  }

  error(error) {
    this.notificationService.error('Erreur lors de l\'upload !', error);
  }

  private initAoc(aocData: any) {
    let aocByArea = [];
    for (let key in aocData) {
      aocByArea.push({key: key, value: this.extractAocInfo(aocData[ key ])});
    }
    aocByArea.sort((a, b) => a.key > b.key ? 1 : -1);
    return aocByArea;
  }

  private extractAocInfo(data: any): AocInfo[] {
    return data.map(aoc => {
      return {
        'subdivision': aoc.Subdivisions,
        'appellation': aoc.Appellations,
        'appellationSearched': UpdatePage.getSearchStringFor(aoc.Appellations),
        'types': aoc[ 'Type de vins produit' ],
        'dryness': aoc[ 'Teneur en sucre' ]
      };
    })
      .sort((a: AocInfo, b: AocInfo) => a.appellation > b.appellation ? 1 : -1);
  }

}
