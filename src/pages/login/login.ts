import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';

// import { AngularFireAuth } from 'angularfire2/auth';
// import { AuthProviders, AuthMethods, AngularFire } from 'angularfire2'
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AngularFireAuth]
})
export class LoginPage {

  user = {} as User;

  constructor(private afauth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  async login(user: User) {
    try{
      const result = this.afauth.auth.signInWithEmailAndPassword(user.email, user.password);
      console.log(result);
      if (result) {
        this.navCtrl.push(HomePage);
      }
    }
    catch(e) {
      console.error(e)
    }
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }

}
