import {Component, OnInit} from '@angular/core';
import {User} from '../../../model/user';
import {LoginService} from '../../../service/login/login.service';
import {NotificationService} from '../../../service/notification.service';
import {NativeStorageService} from '../../../service/native-storage.service';

/**
 * Implémentation qui offre la possibilité de se logger en tatn qu'une des identités déjà connues localement.
 * Lorsque l'utilisateur se logge via mail ou FB ou anonyme, son profile est sauvegardé en local et il peut s'y
 * reconnecter de façon complètement hors connexion. Pas besoin de mot de passe, il choisit juste le login qu'il
 * souhaite adopter.
 */
@Component({
             selector: 'login-page',
             templateUrl: 'local-login.page.html'
           })
export class LocalLoginPage implements OnInit {

  chosenUser: User;
  knownUsers: User[];

  constructor(private loginService: LoginService, private notificationService: NotificationService, private localStorage: NativeStorageService) {
    //super(loginService, notificationService);
  }

  ngOnInit(): void {
    this.localStorage.getKnownUsers()
      .then(users => {
        this.knownUsers = users;
        //this.notificationService.debugAlert('LoginPage: récupération utilisateurs OK: ', users);
      })
      .catch(err => {
        //this.notificationService.debugAlert('LoginPage: La récupération des utilisateurs locaux a échoué: ', err);
        this.localStorage.deleteKnowUsers();
      });
  }

  public loginAs(user: User) {
    this.chosenUser = user;
    this.signin();
  }

  public signin() {
    this.loginService.localLogin(this.chosenUser);
  }
}
