/**
 * Created by loicsalou on 28.02.17.
 */
import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import {BottleService} from '../bottle/bottle-firebase.service';
import {Statistics} from '../bottle/statistics';
import {Bottle} from '../bottle/bottle';
import {AngularFireDatabase} from 'angularfire2/database';
import {AlertController, LoadingController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import Reference = firebase.database.Reference;
import DataSnapshot = firebase.database.DataSnapshot;

/**
 * Services related to the bottles in the cellar.
 * The subregion_label below are duplicated in the code of france.component.html as they are emitted when end-user
 * clicks on a region to filter bottles. Any change on either side must be propagated on the other side.
 */
@Injectable()
export class StatisticsService {

  private snapshot: DataSnapshot;
  private statistics: Statistics;
  private firebaseRef: Reference;
  private _stats: Subject<Statistics> = new Subject<Statistics>();
  private _statsObservable: Observable<Statistics> = this._stats.asObservable();

  constructor(private bottleService: BottleService, private firebase: AngularFireDatabase,
              private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.firebaseRef = this.firebase.database.ref('users/loicsalou/stats');
  }

  get statsObservable(): Observable<Statistics> {
    return this._statsObservable;
  }

  public fetchStatistics() {
    if (this.statistics != null) {
      return;
    }
    this.fetchStatisticsFromFirebase();
    if (this.statistics != null) {
      return;
    }
    this.bottleService.fetchAllBottles();
    let sub: Subscription = this.bottleService.allBottlesObservable.subscribe((bottles: Bottle[]) => {
                                                                                if (bottles.length != 0) {
                                                                                  this.statistics = new Statistics();
                                                                                  this.initStats(bottles);
                                                                                  if (this.statistics != null) {
                                                                                    this.firebaseRef.push(this.statistics);
                                                                                  }
                                                                                  sub.unsubscribe();
                                                                                }
                                                                              }, err => this.alertCtrl.create(this.pushError(err)).present()
    )
  }

  private initStats(bottles: Bottle[]) {
    bottles.forEach((bottle: Bottle) => this.updateFrom(bottle));
    this._stats.next(this.statistics);
  }

  private fetchStatisticsFromFirebase(): void {
    this.firebaseRef.limitToFirst(1).on('value', (stats: DataSnapshot) => {
      this.snapshot = stats;
      this.statistics = stats.val()
    }, err => this.alertCtrl.create({
                                      title: 'Echec',
                                      subTitle: 'Aucune statistique trouvée' + err,
                                      buttons: [ 'Ok' ]
                                    }).present());
  }

  private updateFrom(btl: Bottle) {
    if (!isNaN(+btl.quantite_courante) && +btl.quantite_courante > 0) {
      let nbBottles = +btl.quantite_courante;
      this.statistics.totalNumberOfBottles += nbBottles;
      this.update(this.statistics.by_classe_age, btl.classe_age, nbBottles);
      this.update(this.statistics.by_area_label, btl.area_label, nbBottles);
      this.update(this.statistics.by_country_label, btl.country_label, nbBottles);
      this.update(this.statistics.by_label, btl.label, nbBottles);
      this.update(this.statistics.by_millesime, btl.millesime, nbBottles);
      this.update(this.statistics.by_nomCru, btl.nomCru, nbBottles);
      this.update(this.statistics.by_prix, this.getPriceCategory(btl.prix), nbBottles);
      this.update(this.statistics.by_subregion_label, btl.subregion_label, nbBottles);
      this.update(this.statistics.by_volume, btl.volume, nbBottles);
    }
  }

  private getPriceCategory(prix: string): string {
    if (isNaN(+prix)) {
      return '-';
    }
    if (+prix < 10) {
      return 'pas-cher';
    }
    if (+prix < 20) {
      return 'correct';
    }
    if (+prix < 30) {
      return 'moyen';
    }
    if (+prix < 50) {
      return 'assez-cher';
    }
    return 'cher';
  }

  private update(category: Map<string, number>, axis: string, nbBottles: number) {
    if (!category.get(axis)) {
      category.set(axis, 0);
    }
    category.set(axis, category.get(axis) + nbBottles);
  }

  private pushError(err) {
    return {
      title: 'Echec',
      subTitle: 'l\'écriture des données statistiques en DB a échoué: ' + err,
      buttons: [ 'Ok' ]
    }
  }
}


