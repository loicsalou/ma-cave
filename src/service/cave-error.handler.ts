import {ErrorHandler, Injectable} from '@angular/core';
import {FirebaseConnectionService} from './firebase-connection.service';

@Injectable()
export class CaveErrorHandler extends ErrorHandler {
  private count: number = 0;

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
    if (this.count++ < 30) {
      try {
        this.dataConnection.logError(err);
      }
      catch (e) {
      }
    }
  }
}
