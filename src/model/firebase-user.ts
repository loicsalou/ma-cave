import * as firebase from 'firebase';
import {User} from './user';

export class FirebaseUser extends User {
  constructor(user: firebase.User) {
    super();
    if (user.email == null) {
      this.email = 'cave.explorer@gmail.com';
    }
    if (user.email == null) {
      this.email = 'cave.explorer@gmail.com';
    }
    this.user = user.email.replace(/[\.]/g, '');
    this.email = user.email;
    this.user = this.user.replace(/[#.]/g, '');

    this.photoURL = user.photoURL;
    this.uid = user.uid;
    this.phoneNumber = user.phoneNumber;
    this.displayName = user.displayName;
    this.loginType = 'firebase';
  }
}
