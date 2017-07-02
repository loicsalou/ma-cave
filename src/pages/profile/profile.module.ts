import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),

  ],
  exports: [
    ProfilePage
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class ProfilePageModule {}
