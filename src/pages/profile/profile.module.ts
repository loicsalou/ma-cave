import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ProfilePage} from './profile';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../components/shared.module';

@NgModule({
            declarations: [
              ProfilePage,
            ],
            imports: [
              BrowserModule,
              FormsModule,
              SharedModule,
              IonicPageModule.forChild(ProfilePage),
            ],
            exports: [
              ProfilePage
            ]
          })
export class ProfilePageModule {
}
