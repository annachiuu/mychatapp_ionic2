import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { LoginPage } from '../login/login';
import { Profiles } from '../../models/profiles';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  profileData : FirebaseObjectObservable<Profiles>


  constructor(private afauth: AngularFireAuth, private toast: ToastController, private afdata: AngularFireDatabase,
    public navCtrl: NavController) {
  }

  ionViewWillLoad() {
    this.afauth.authState.subscribe(data => {
      if (data && data.uid && data.email){
      this.toast.create({
        message: 'Welcome to MyChatApp ' + data.uid,
        duration: 200 //Change to 2000 later
      }).present()

    this.profileData = this.afdata.object(`profile/${data.uid}`)

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
