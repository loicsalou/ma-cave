import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';
import {isMobileDevice} from '../../utils';
import {NotificationService} from '../../service/notification.service';
import {FacingMode, MediaConstraintsBuilder} from '../../utils/media-constraints.builder';

@IonicPage()
@Component({
             templateUrl: 'camera-popover.page.html'
           })
export class CameraPopoverPage implements OnInit {
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('video') video: ElementRef;

  constructor(private viewCtrl: ViewController, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.video.nativeElement.height = '300';
    this.video.nativeElement.width = '180';
    this.canvas.nativeElement[ 'max-height' ] = '300';
    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    const height = 300;
    const width = 180;
    let builder = new MediaConstraintsBuilder();
    builder
      .withAspectRatio(width / height, width / height);

    if (supportedConstraints[ 'facingMode' ]) {
      if (isMobileDevice()) {
        builder.withFacingMode(FacingMode.ENVIRONMENT, FacingMode.ENVIRONMENT)
          .withHeight(width, width)
          .withWidth(height, height);
      } else {
        builder.withFacingMode(FacingMode.USER, FacingMode.USER)
          .withHeight(height, height)
          .withWidth(width, width);
      }
    }
    this.startVideo(builder.build());
  }

  snapshot() {
    try {
      this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
      this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
      this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0,
                                                           this.canvas.nativeElement.width,
                                                           this.canvas.nativeElement.height);
      let canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
      canvasElement.toBlob(blob => {
        this.closeWithResult(true, blob);
      });
    } finally {
      this.stopVideo();
    }
  }

  cancelSnapshot() {
    this.stopVideo();
    this.closeWithResult(false, undefined);
  }

  closeWithResult(captured: boolean, file?: Blob) {
    this.viewCtrl.dismiss({captured: captured, file: file});
  }

  private startVideo(constraints: MediaStreamConstraints) {
    alert('supporté:' + JSON.stringify(navigator.mediaDevices.getSupportedConstraints()));
    alert('demandé:' + JSON.stringify(constraints));
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        alert('capacités:' + (stream.getVideoTracks() ? JSON.stringify(stream.getVideoTracks()[ 0 ].getCapabilities()) : ''));
        alert('obtenu:' + (stream.getVideoTracks() ? JSON.stringify(stream.getVideoTracks()[ 0 ].getSettings()) : ''));
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
