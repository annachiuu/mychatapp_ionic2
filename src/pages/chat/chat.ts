import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Message } from '../../models/message';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Profiles } from '../../models/profiles';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  
  message = {} as Message;
  messageList: Observable<any>;
  
  currentFriend: FirebaseObjectObservable<Profiles>;
  currentFID: string;

  friendMessageList: Observable<any>;

  constructor(private afauth: AngularFireAuth, private afdata: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams) {

  }
  
  retrieveUserMessages() {
    let uid = this.afauth.auth.currentUser.uid
    this.messageList = this.afdata.list(`profile/${uid}/myMessages/${this.currentFID}`)
    .map((messages) => {
      return messages.map(message => {
        message.data = this.afdata.object(`messages/${message.$key}`)
          return message
       })
    })
  }

  retrieveFriendMessages() {
    let uid = this.afauth.auth.currentUser.uid
    this.friendMessageList = this.afdata.list(`profile/${this.currentFID}/myMessages/${uid}`)
    .map((messages) => {
      return messages.map(message => {
        message.data = this.afdata.object(`messages/${message.$key}`)
          return message
       })
    })

    console.log(this.friendMessageList)
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    let friend = this.navParams.get('friend')

    this.currentFID = friend.$key;    
    this.currentFriend = this.afdata.object(`profile/${friend.$key}`)

    this.retrieveUserMessages()
    this.retrieveFriendMessages()
  
  }

  send() {
    if (this.message.text) {
    //add to messages branch in fb
    this.message.uid = this.afauth.auth.currentUser.uid
    this.message.fid = this.currentFID //change it later

    this.afauth.authState.take(1).subscribe(auth => {
        this.afdata.list(`messages`).push(this.message)
        .then((item) => {
          //Push message key into myMessages for fan-out
          this.afdata.object(`profile/${this.message.uid}/myMessages/${this.currentFID}/${item.key}/`).set("1")
        });
    })
  }

  }

}
