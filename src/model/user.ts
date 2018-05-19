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
  public loginType: 'facebook' | 'local' | 'anonymous' | 'email' | 'google';
}
