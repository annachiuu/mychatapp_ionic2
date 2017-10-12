import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';

// @IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  user = {} as User;

  constructor(private afauth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  console.log('ionViewDidLoad SignupPage');
  }


  async signup(user: User) {
    try {
      const result = await this.afauth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password);
      console.log(result);
      this.navCtrl.push(HomePage);
    }
    catch(e) {
      console.error(e);
    }
  }

}
