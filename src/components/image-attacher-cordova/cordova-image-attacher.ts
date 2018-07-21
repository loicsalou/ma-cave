import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BottleMetadata} from '../../model/bottle';
import {ImagePersistenceService, UploadMetadata} from '../../service/image-persistence.service';
import {NotificationService} from '../../service/notification.service';
import {Subscription} from 'rxjs';

/**
 * Generated class for the CordovaImageAttacherComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
             selector: 'cordova-image-attacher',
             templateUrl: 'cordova-image-attacher.html'
           })
export class CordovaImageAttacherComponent {
  progress: number;
  progressSubscription: Subscription;
  @Input()
  metadata: BottleMetadata;
  @Output()
  imageUrl: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  error: EventEmitter<any> = new EventEmitter<any>();
  private loadingInProgress: boolean = false;

  constructor(private imageService: ImagePersistenceService, private notificationService: NotificationService) {
    this.progressSubscription = this.imageService.progressEvent.subscribe(
      value => this.progress = value,
      error => this.notificationService.error('Erreur d\'upload de l\'image', error),
      () => this.progressSubscription.unsubscribe()
    );
  }

  captureProfileImage(): void {
  }

  removeProfileImage(): void {
    this.imageUrl.emit(undefined);
  }

// TAKE FROM THE EXISTING PHOTOS
  chooseProfileImage(): void {
    this.loadingInProgress = true;
  }
}
