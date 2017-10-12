import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Message } from '../../models/message';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import 'rxjs/add/operator/filter';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  message = {} as Message;
  messageListRef$: FirebaseListObservable<message[]>;
  recievedListRef$: FirebaseListObservable<message[]>;

  constructor(private afauth: AngularFireAuth, private afdata: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams) {

        this.messageListRef$ = this.afdata.list(`messages`, {
          query: {
            orderByChild: 'uid',
            equalTo: this.afauth.auth.currentUser.uid
          }
        });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  send() {
    //add to messages branch in fb
    this.message.uid = this.afauth.auth.currentUser.uid
    this.message.fid = "SSyLZi4CHxbVNIeNHwrJEbCSPIH3" //change it later
    this.message.time = Date()

    this.afauth.authState.take(1).subscribe(auth => {
        this.afdata.list(`messages`).push(this.message)
        .then((item) => {
          //Push message key into myMessages for fan-out
          this.afdata.object(`profile/${this.message.uid}/myMessages/${item.key}`).set("1")
        });
    })


  }

}
