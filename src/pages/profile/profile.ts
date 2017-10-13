import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Profiles } from '../../models/profiles';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile = {} as Profiles;

  constructor(private afauth: AngularFireAuth, private afdata: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  saveProfile(profile: Profiles) {
    //capture the auth state
    this.afauth.authState.take(1).subscribe(auth => {
      this.afdata.object("profile/" + auth.uid ).set(this.profile)
        .then(() => this.navCtrl.setRoot(TabsPage));
    })


  }

}
