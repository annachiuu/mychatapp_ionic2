import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';


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


  async signup(user: User) {
    try {
      const result = await this.afauth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password);
      console.log(result);
    }
    catch(e) {
      console.error(e);
    }
  }

}
