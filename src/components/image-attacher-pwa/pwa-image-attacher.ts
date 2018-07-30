import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BottleMetadata} from '../../model/bottle';
import {ImagePersistenceService, UploadMetadata} from '../../service/image-persistence.service';
import {NotificationService} from '../../service/notification.service';
import {Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import {Action} from '../../model/action';
import {PopoverController} from 'ionic-angular';

@Component({
             selector: 'pwa-image-attacher',
             templateUrl: 'pwa-image-attacher.html'
           })
export class PwaImageAttacherComponent implements OnInit {
  progress: number;
  progressSubscription: Subscription;
  @Input()
  metadata: BottleMetadata;
  @Output()
  imageUrl: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  error: EventEmitter<any> = new EventEmitter<any>();
  capturing = false;
  captured = false;

  @ViewChild('fileSelector') fileSelector: ElementRef;

  private loadingInProgress: boolean = false;

  constructor(private imageService: ImagePersistenceService, private notificationService: NotificationService,
              private popoverCtrl: PopoverController) {
    this.progressSubscription = this.imageService.progressEvent.subscribe(
      value => this.progress = value,
      error => this.notificationService.error('Erreur d\'upload de l\'image', error),
      () => this.progressSubscription.unsubscribe()
    );
  }

  ngOnInit() {
  }

  toggleCapture(ev: Event) {
    this.showCameraPopover(ev);
  }

  removeProfileImage(): void {
    this.imageUrl.emit(undefined);
  }

  readBrowserFile(event: any) {
    //let textType = /text.*/;
    let file = event.currentTarget.files[ 0 ];
    this.loadingInProgress = true;
    this.imageService.uploadImage(file, this.metadata)
      .then((meta: UploadMetadata) => {
        this.notificationService.information('L\'image ' + meta.imageName + ' a été correctement enregistrée');
        this.loadingInProgress = false;
        this.imageUrl.emit(meta.downloadURL);
      })
      .catch(error => {
               this.loadingInProgress = false;
               this.error.emit(error);
             }
      );
  }

  showCameraPopover(myEvent) {
    let popover = this.popoverCtrl.create('CameraPopoverPage', {}, {cssClass: 'shadowed-grey'});
    popover.onDidDismiss((action: {captured: boolean, file?: Blob}) => {
      if (action != null) {
        let {captured, file} = action;
        if (captured) {
          this.saveSnapshot(file);
        }
      }
    });
    popover.present({
                      ev: myEvent
                    });
  }

  private saveSnapshot(file: Blob) {
    this.capturing = false;
    this.loadingInProgress = true;
    this.captured = true;
    this.notificationService.ask('question', 'app.keep-image-confirm')
      .pipe(take(1)).subscribe(
      resp => {
        if (resp) {
          this.uploadImage(file, this.metadata);
        }
        this.captured = false;
      }
    );
  }

  private uploadImage(file: Blob, metadata: BottleMetadata) {
    this.imageService.uploadImage(file, metadata)
      .then((meta: UploadMetadata) => {
        this.notificationService.information('L\'image ' + meta.imageName + ' a été correctement enregistrée');
        this.loadingInProgress = false;
        this.imageUrl.emit(meta.downloadURL);
      })
      .catch(error => {
               this.loadingInProgress = false;
               this.error.emit(error);
             }
      );
  }
}
