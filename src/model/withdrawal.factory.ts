/**
 * Created by loicsalou on 25.05.17.
 */
import {Inject, Injectable} from '@angular/core';
import {Bottle} from './bottle';
import {TranslateService} from '@ngx-translate/core';
import {BottleFactory} from './bottle.factory';
import {Withdrawal} from './withdrawal';

/**
 * Instanciation des sorties de bouteilles.
 * Cette factory en profite pour ajouter des attributs à la volée:
 * - un ID qui n'existe pas (pas encore) dans la DB
 * - une tranche d'âge, jeune, moyen, vieux, très vieux... pour le filtrage
 */
@Injectable()
export class WithdrawalFactory extends BottleFactory {

  constructor(i18n: TranslateService, @Inject('GLOBAL_CONFIG') config) {
    super(i18n, config);
  }

  public create(withdrawal: Withdrawal): Withdrawal {
    let btl: Bottle = super.create(withdrawal);
    let wth = new Withdrawal(btl);
    wth.notation = withdrawal.notation;
    wth.withdrawal_date = withdrawal.withdrawal_date;
    return wth;
  }

  public createAll(withdrawals: Withdrawal[]): Withdrawal[] {
    return withdrawals.map(wth => this.create(wth));
  }
}
