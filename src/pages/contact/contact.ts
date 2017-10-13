import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { Profiles } from '../../models/profiles';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  friendsListRef$: FirebaseListObservable<string[]>;
  
  
  constructor(private afauth: AngularFireAuth, private afdata: AngularFireDatabase,
    public alertCtrl: AlertController,
    public navCtrl: NavController) {

      //Retrieve list of friend's UID from firebase
      let uid = this.afauth.auth.currentUser.uid
      this.afdata.list(`profile/${uid}/myFriends/`).subscribe(data => {
        console.log(data, 'run till here')
        data.forEach( friend => {
          console.log(friend.$key)
          //Use each UID to display profile
        })

      })

  }
  
  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Add Friend',
      message: "Enter username of friend",
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked', data.username);
            this.saveNewFriend(data.username)
          }
        }
      ]
    });
    prompt.present();
  }

saveNewFriend(user: string) {
  console.log(`about to save username: ${user} as new friend`)
  //Reference username to find UID of friend
  this.afdata.list(`profile`,{
    query: {
      orderByChild: 'username',
      equalTo: user
    }
  }).subscribe(data => {
    console.log(data[0].$key)
    //Add UID into friendList under profile
    let userkey = data[0].$key
    this.addToFriendList(userkey)

  })
}
addToFriendList(key: string) {
  let uid = this.afauth.auth.currentUser.uid
  this.afdata.object(`profile/${uid}/myFriends/${key}`).set(1)
}



}
