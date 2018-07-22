import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {BottleMetadata} from '../../model/bottle';
import {ImagePersistenceService, UploadMetadata} from '../../service/image-persistence.service';
import {NotificationService} from '../../service/notification.service';
import {Subscription} from 'rxjs';

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

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('video') video: ElementRef;
  @ViewChild('fileSelector') fileSelector: ElementRef;

  private loadingInProgress: boolean = false;
  private constraints: MediaStreamConstraints = {
    audio: false,
    video: true
  };

  constructor(private imageService: ImagePersistenceService, private notificationService: NotificationService) {
    this.progressSubscription = this.imageService.progressEvent.subscribe(
      value => this.progress = value,
      error => this.notificationService.error('Erreur d\'upload de l\'image', error),
      () => this.progressSubscription.unsubscribe()
    );
  }

  ngOnInit() {
    this.video.nativeElement.height = '300';
    this.video.nativeElement.width = '200';
    this.canvas.nativeElement[ 'max-height' ] = '300';
  }

  toggleCapture() {
    this.capturing = !this.capturing;
    if (this.capturing) {
      this.startVideo(this.constraints);
    } else {
      this.stopVideo();
    }
  }

  snapshot() {
    this.capturing = false;
    this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
    this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0,
                                                         this.canvas.nativeElement.width,
                                                         this.canvas.nativeElement.height);
    let canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    canvasElement.toBlob(blob => {
      this.saveSnapshot(blob);
    });
    this.stopVideo();
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

  private saveSnapshot(file: Blob) {
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

  private startVideo(constraints: MediaStreamConstraints) {
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        this.video.nativeElement.srcObject = stream;
      })
      .catch(err => this.notificationService.error('problème au démarrage de la vidéo', err));
  }

  private stopVideo() {
    let stream: MediaStream = this.video.nativeElement.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach(function (track) {
      track.stop();
    });

    this.video.nativeElement.srcObject = null;
  }

}
