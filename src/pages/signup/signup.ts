import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ProfilePage } from '../profile/profile';

// @IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  user = {} as User;
  password2: string;

  constructor(private afauth: AngularFireAuth,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  console.log('ionViewDidLoad SignupPage');
  }


  async signup(user: User) {
    if (this.user.password == this.password2) {
      try {
        const result = await this.afauth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password);
        console.log(result);
        this.navCtrl.setRoot(ProfilePage);
      }
      catch(e) {
        console.error(e);
      }
    } else {
      //Tell user password does not match
    }

  }

}
