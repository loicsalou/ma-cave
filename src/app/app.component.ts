import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {SplashScreen} from '@ionic-native/splash-screen';
import {HomePage} from './home/home';
import {logInfo} from '../utils';

@Component({
             templateUrl: 'app.html'
           })
export class MyCaveApp {
  selectedTheme = 'ionic-theme';
  rootPage = HomePage;

  constructor(platform: Platform, translate: TranslateService) {
    platform.ready().then(() => {
      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('fr');

      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('fr');
    });
  }
}
