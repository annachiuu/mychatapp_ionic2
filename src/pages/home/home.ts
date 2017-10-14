import { Component } from '@angular/core';
import { NavController, ToastController, App, Toast } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { LoginPage } from '../login/login';
import { Profiles } from '../../models/profiles';
import firebase from 'firebase'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  profileData : FirebaseObjectObservable<Profiles>
  toastInstance: Toast;

  constructor(private afauth: AngularFireAuth, 
    private toast: ToastController, 
    private afdata: AngularFireDatabase,
    private app: App,
    public navCtrl: NavController) {
  }

  

  ionViewDidEnter() {

  firebase.auth().onAuthStateChanged(data => {
    if (data) {
      this.profileData = this.afdata.object(`profile/${data.uid}`)
      this.toast.create({
        message: 'Welcome!',
        duration: 2000,
        position: 'top'
      }).present()
    } else {
      this.toast.create({
        message: 'Unable to find Account',
        duration: 2000,
        position: 'top'
      }).present()
      this.navCtrl.setRoot(LoginPage)
    }
    })
  }

  logout() {
    firebase.auth().signOut()
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        console.log('logout unsucessful')
      } else {
        console.log('loggedOut');
        this.app.getRootNav().setRoot(LoginPage)
      }
    })
  }
}
