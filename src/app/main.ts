import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app.module';
import {enableProdMode} from '@angular/core';
import {setLogLevel} from '../utils';

//if (environment.production) {
enableProdMode();
setLogLevel('TRACE');
//}

platformBrowserDynamic().bootstrapModule(AppModule);
