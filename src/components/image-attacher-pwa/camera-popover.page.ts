import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';
import {logInfo} from '../../utils';
import {NotificationService} from '../../service/notification.service';

@IonicPage()
@Component({
             templateUrl: 'camera-popover.page.html'
           })
export class CameraPopoverPage implements OnInit {
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('video') video: ElementRef;
  // max height: 720 cf
  private constraints: MediaStreamConstraints = {
    audio: false,
    video: {
      advanced: [
        {
          aspectRatio: 180 / 300,
          width: 180,
          height: 300
        }
      ]
    }
  };

  constructor(private viewCtrl: ViewController, private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.video.nativeElement.height = '300';
    this.video.nativeElement.width = '180';
    this.canvas.nativeElement[ 'max-height' ] = '300';
    this.startVideo(this.constraints);
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
    logInfo('supporté:' + JSON.stringify(navigator.mediaDevices.getSupportedConstraints()));
    logInfo('demandé:' + JSON.stringify(constraints));
    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        logInfo('capacités:' + stream.getVideoTracks() ? JSON.stringify(stream.getVideoTracks()[ 0 ].getCapabilities()) : '');
        logInfo('obtenu:' + stream.getVideoTracks() ? JSON.stringify(stream.getVideoTracks()[ 0 ].getSettings()) : '');
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
