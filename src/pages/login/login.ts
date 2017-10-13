import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { ProfilePage } from '../profile/profile';
import { SignupPage } from '../signup/signup';
import firebase from 'firebase'

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AngularFireAuth]
})
export class LoginPage {

  user = {} as User;

  constructor(private afauth: AngularFireAuth, private app: App,
    public navCtrl: NavController, public navParams: NavParams) {
      firebase.auth().onAuthStateChanged( user => {
        if (user) {
          this.navCtrl.setRoot(TabsPage)
        } else {
          console.log('None logged in')          
        }
      })

  }

  async login(user: User) {
    try{
      const result = firebase.auth().signInWithEmailAndPassword(user.email, user.password);
      console.log(result);
      if (result) {
        this.navCtrl.setRoot(TabsPage);
      } else {
        this.app.getRootNav().setRoot(LoginPage)        
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
