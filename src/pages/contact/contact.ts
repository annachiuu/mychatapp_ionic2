import { Component } from '@angular/core';
import { NavController,AlertController } from 'ionic-angular';
import { Profiles } from '../../models/profiles';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ChatPage } from '../chat/chat';


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  friendsListRef$: FirebaseListObservable<Profiles[]>;
  friendsArr = [];
  friends: FirebaseObjectObservable<Profiles[]>;
  userFriends: Observable<any>;
  
  constructor(private afauth: AngularFireAuth, private afdata: AngularFireDatabase,
    public alertCtrl: AlertController,
    public navCtrl: NavController) {

      let uid = this.afauth.auth.currentUser.uid      
      this.userFriends = this.afdata.list(`profile/${uid}/myFriends`)
      .map((friends) => {
        return friends.map(friend => {
          friend.data = this.afdata.object(`profile/${friend.$key}`)
          return friend
        })
      })


  }
  addProfile(uid: string) {
    let profile = this.afdata.object(`profile/${uid}`)
    this.friendsArr.push(profile)
    console.log(profile)
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

friendSelected(friend: Profiles) {
    this.navCtrl.push(ChatPage, {
      friend: friend
    });
}


}
