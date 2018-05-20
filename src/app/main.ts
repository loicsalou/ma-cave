import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app.module';
import {environment} from '../environments/environment.prod';
import {enableProdMode} from '@angular/core';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
