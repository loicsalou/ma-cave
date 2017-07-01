/**
 * Created by loicsalou on 27.06.17.
 */
export class User {

  private _user: string;
  private _email: string;
  private _photoURL: string;
  private _displayName: string;
  private _phoneNumber: string;
  private _uid: string;

  get user(): string {
    return this._user;
  }

  get email(): string {
    return this._email;
  }

  get photoURL(): string {
    return this._photoURL;
  }

  get displayName(): string {
    return this._displayName;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  get uid(): string {
    return this._uid;
  }

  set user(value: string) {
    this._user = value;
  }

  set email(value: string) {
    this._email = value;
  }

  set photoURL(value: string) {
    this._photoURL = value;
  }

  set displayName(value: string) {
    this._displayName = value;
  }

  set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  set uid(value: string) {
    this._uid = value;
  }
}
