import {ErrorHandler, Injectable} from '@angular/core';
import {FirebaseAdminService} from './firebase/firebase-admin.service';

@Injectable()
export class CaveErrorHandler extends ErrorHandler {
  private count: number = 0;

  constructor(private dataConnection: FirebaseAdminService) {
    super();
  }

  /**
   * Copié de Ionic
   * @param {?} err
   * @return {?}
   */
  handleError(err:Error) {
    super.handleError(err);
    if (this.count++ < 30) {
      let stack='no stack';
      try {
        stack=err.stack;
      }
      catch (e) {
      }
      try {
        this.dataConnection.logError(err+': '+stack);
      }
      catch (e) {
      }
    }
  }
}
