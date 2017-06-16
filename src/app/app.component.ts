import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TabsPage} from '../pages/tabs/tabs';
import {LoginService} from '../pages/home/login.service';
import {EmailLoginService} from '../pages/home/email-login.service';

@Component({
             templateUrl: 'app.html'
           })
export class MyCaveApp {
  rootPage = TabsPage;

  constructor(platform: Platform, translate: TranslateService, statusBar: StatusBar, splashScreen: SplashScreen,
              private loginService: LoginService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('fr');

      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('fr');

      // login
      //if (this.loginService instanceof EmailLoginService) {
      //  (<EmailLoginService>this.loginService).setLogin('business.salou@gmail.com','!2bgbne1');
      //  this.loginService.login();
      //}
    });
  }

}
