import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Message } from '../../models/message';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Profiles } from '../../models/profiles';

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
  messageList: Observable<any>;
  
  currentFriend: FirebaseObjectObservable<Profiles>;
  
  constructor(private afauth: AngularFireAuth, private afdata: AngularFireDatabase,
    public navCtrl: NavController, public navParams: NavParams) {
       
        //Retrieve messages through .map (fan-out)
        let uid = this.afauth.auth.currentUser.uid
        this.messageList = this.afdata.list(`profile/${uid}/myMessages`)
        .map((messages) => {
          return messages.map(message => {
            message.data = this.afdata.object(`messages/${message.$key}`)
            return message
          })
        })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    let friend = this.navParams.get('friend')

    this.afdata.object(`profile/${friend.$key}`).subscribe(data => {
      console.log(data)
    })

    this.currentFriend = this.afdata.object(`profile/${friend.$key}`)

  }

  send() {
    //add to messages branch in fb
    this.message.uid = this.afauth.auth.currentUser.uid
    this.message.fid = "SSyLZi4CHxbVNIeNHwrJEbCSPIH3" //change it later

    this.afauth.authState.take(1).subscribe(auth => {
        this.afdata.list(`messages`).push(this.message)
        .then((item) => {
          //Push message key into myMessages for fan-out
          this.afdata.object(`profile/${this.message.uid}/myMessages/${item.key}`).set("1")
        });
    })


  }

}
