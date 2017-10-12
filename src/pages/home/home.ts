import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private afauth: AngularFireAuth, private toast: ToastController,
    public navCtrl: NavController) {

  }

  ionViewWillLoad() {
    this.afauth.authState.subscribe(data => {
      if (data.email){
      this.toast.create({
        message: 'Welcome to MyChatApp',
        duration: 2000
      }).present()
    } else {
      this.toast.create({
        message: 'Unable to find Account',
        duration: 2000
      }).present()
      this.navCtrl.setRoot(LoginPage)
    }
    })
  }

}
