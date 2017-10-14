import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, Platform } from 'ionic-angular';
import { Message } from '../../models/message';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Profiles } from '../../models/profiles';
import { Media, MediaObject } from '@ionic-native/media';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  private _audioFile: MediaObject;
  private _platform: Platform;
  private _pathFile: string;
  private _nameFile: string;

  
  message = {} as Message;
  messageList: Observable<any>;
  
  currentFriend: FirebaseObjectObservable<Profiles>;
  currentFID: string;

  friendMessageList: Observable<any>;
  currentUserName: string;

  constructor(private afauth: AngularFireAuth, private afdata: AngularFireDatabase,
    private media: Media,public platform: Platform, public alertCtrl: AlertController,
    public navCtrl: NavController, public navParams: NavParams,) {

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    let friend = this.navParams.get('friend')
    let uid = this.afauth.auth.currentUser.uid

    this.afdata.object(`profile/${uid}`).subscribe(data => {
      this.currentUserName = data.firstName + " " + data.lastName;
    })
    this.currentFID = friend.$key;    
    this.currentFriend = this.afdata.object(`profile/${friend.$key}`)

    this.retrieveUserMessages()
  

  }

  send() {
    if (this.message.text) {

    //fill in message details
    this.message.uid = this.afauth.auth.currentUser.uid
    this.message.fid = this.currentFID //change it later
    this.message.time = new Date()
    this.message.owner = this.currentUserName

  //add to messages branch in fb
    this.afauth.authState.take(1).subscribe(auth => {
        this.afdata.list(`messages`).push(this.message)
        .then((item) => {
          //Push message key into myMessages for fan-out
          this.afdata.object(`profile/${this.message.uid}/myMessages/${this.currentFID}/${item.key}/`).set("1")
          this.afdata.object(`profile/${this.currentFID}/myMessages/${this.message.uid}/${item.key}/`).set("1")          
        });
    })
  }

  }


  public startRecording(): void {
    try {
    this._pathFile = this.getPathFileRecordAudio();
    this._audioFile = this.media.create(this._pathFile);
    this._audioFile.startRecord()
    } catch (e) {
      this.showAlert('Could not start recording')      
    }
  }

  public  stopRecording() {
    try {
      this._audioFile.stopRecord()
      } catch (e) {
      this.showAlert('Could not stop recording')              
      }
  }

  public startPlayback() {
    try {
      this._audioFile = this.media.create(this._pathFile)
      this._audioFile.play()
    } catch (e) {
      this.showAlert('Could not start play')
    }
  }

  public stopPlayback() {
    try {
      this._audioFile.stop()
    } catch (e) {
      this.showAlert('Could not stop')
    }
  }

  private getPathFileRecordAudio(): string {
    let path: string = (this._platform.is('ios') ? '../Library/NoCloud/': '../Documents/');
    return path + this._nameFile + '-' + '.wav';
  }

  //Alert Controller method
  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }



}
