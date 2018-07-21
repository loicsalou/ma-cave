import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {HomePage} from './home/home';

@Component({
             templateUrl: 'app.html'
           })
export class MyCaveApp {
  selectedTheme = 'ionic-theme';
  rootPage = HomePage;

  constructor(platform: Platform, translate: TranslateService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('fr');

      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('fr');
    });
  }
}
