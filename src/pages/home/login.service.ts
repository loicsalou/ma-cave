import {EventEmitter, Output} from '@angular/core';
/**
 * Created by loicsalou on 13.06.17.
 */

export abstract class LoginService {
  @Output()
  public authentified: EventEmitter<string>=new EventEmitter();

  private _user: string;
  private _psw: string;

  public abstract login();

  public getUser(): string {
    return this._user;
  }

  get user(): string {
    return this._user;
  }

  get psw(): string {
    return this._psw;
  }

  set user(value: string) {
    this._user = value;
  }

  set psw(value: string) {
    this._psw = value;
  }

  public success(user: string) {
    this._user=user;
    this.authentified.emit(user);
  }

}
