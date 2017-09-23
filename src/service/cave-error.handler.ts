import {ErrorHandler} from '@angular/core';

export class CaveErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    alert('Une erreur s\'est produite !' + err )
  }
}
