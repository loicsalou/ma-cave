import * as firebase from 'firebase';

/**
 * Created by loicsalou on 27.06.17.
 */
export class User {
  public user: string;
  public email: string;
  public photoURL: string;
  public displayName: string;
  public phoneNumber: string;
  public uid: string;
  public loginType: string;
}

export class FirebaseUser extends User {
  constructor(user: firebase.User) {
    super();
    this.user = user.email.replace(/[\.]/g, '');
    this.user = this.user.replace(/[#.]/g, '');
    this.email = user.email;
    this.photoURL = user.photoURL;
    this.uid = user.uid;
    this.phoneNumber = user.phoneNumber;
    this.displayName = user.displayName;
    this.loginType = 'firebase';
  }
}
