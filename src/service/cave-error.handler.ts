import {ErrorHandler, Injectable} from '@angular/core';
import {FirebaseConnectionService} from './firebase-connection.service';

@Injectable()
export class CaveErrorHandler extends ErrorHandler {
  constructor(private dataConnection: FirebaseConnectionService) {
    super();
  }

  /**
   * Copié de Ionic
   * @param {?} err
   * @return {?}
   */
  handleError(err) {
    super.handleError(err);
    try {
      this.dataConnection.logError(err);
    }
    catch (e) {
    }
  }
}
