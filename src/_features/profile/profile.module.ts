import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ProfilePage} from './profile';
import {SharedModule} from '../../components/shared.module';

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              SharedModule,
              IonicPageModule.forChild(ProfilePage)
            ],
            declarations: [
              ProfilePage
            ],
            entryComponents: [
              ProfilePage
            ],
            exports: [
              ProfilePage
            ]
          })
export class ProfileModule {
}
