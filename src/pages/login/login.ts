import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { ProfilePage } from '../profile/profile';
import { SignupPage } from '../signup/signup';


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
        this.navCtrl.setRoot(TabsPage);
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
