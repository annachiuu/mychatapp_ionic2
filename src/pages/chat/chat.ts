import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, Platform } from 'ionic-angular';
import { Message } from '../../models/message';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Profiles } from '../../models/profiles';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  testDir: string;
  downloadURL: string;
  private _audioFile: MediaObject;
  private _platform: Platform;
  private _pathFile: string;

  message = {} as Message;
  messageList: Observable<any>;

  currentFriend: FirebaseObjectObservable<Profiles>;
  currentFID: string;

  friendMessageList: Observable<any>;
  currentUserName: string;

  constructor(private afauth: AngularFireAuth, private afdata: AngularFireDatabase,
    public media: Media, private file: File, public platform: Platform, public alertCtrl: AlertController,
    public navCtrl: NavController, public navParams: NavParams, ) {
      this._platform = platform;
      
      
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

  retrieveVoiceMessage(message: Message) {
    console.log('Attempt retrieve voice message')

    //only retrieve those that are voice messages
    if (message.voiceMessage) {
      let storageRef = firebase.storage().refFromURL(message.text)
      storageRef.getDownloadURL().then(url => {
        let messageLength = this.media.create(url)
        this.showAlert(`Message duration: ${messageLength}`)
      }).catch(e => {
        console.log(e)
      })
    }
  }

  async send() {
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
          //Reset message after block above is finished
          this.message.text = null
      })
    }

  }

  uploadToFirebase() {
    console.log('Uploading to firebase...');
    let path = this.getPathRecordAudio();
    // let fileName = 'temp.wav'
    // this.file.createFile(path, 'test.wav', true).then(data => {
      try {
        this.file.readAsDataURL(path, 'temp.wav').then(dataURL => {
          console.log(dataURL, 'read as data URL')
          let storageRef = firebase.storage().ref();
          let newMessageKey = this.makeid() + '.wav';
          storageRef.child(`messageUploads/${newMessageKey}`).putString(dataURL, 'data_url').then(snap => {
            console.log(snap, 'Uploaded to firebase')
            
            //Get download URL and send to messages
            this.downloadURL = snap.downloadURL
            this.message.text = this.downloadURL
            this.message.voiceMessage = true;
            this.send()
    
          })
        })
      } catch (e) {
        console.log(e)
      }

  }

  public startRecording(): void {
    try {
    let path = this.getPathRecordAudio();
    console.log('attempt to record into' + path)
    let fileName = 'temp.wav'
    this._pathFile = path + fileName;
    this.file.createFile(path, fileName, true).then(fileEntry => {
      console.log(fileEntry.name, 'Created fileEntry here')
      this._audioFile = this.media.create(fileEntry.name)
      this._audioFile.startRecord()
      setTimeout(() => {
        this.stopRecording()
      }, 3500)
      setTimeout(() => {
        this.uploadToFirebase()
      }, 5000)
    })

    } catch (e) {
      this.showAlert('Could not start recording')      
    }
  }

  public stopRecording() {
    try {
      this._audioFile.stopRecord()
      console.log('stopped recording')
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

  private getPathRecordAudio(): string {
    if (this._platform.is('ios')) {
      return this.file.tempDirectory;  
    }  else if (this.platform.is('android')) {
      return this.file.externalRootDirectory;
    }
  }

  // private getFileName(): string {
  //   let fileType: string = (this._platform.is('ios') ? '.wav'  : '.3pg');
  //   return 'temp' + fileType
  // }


  //Alert Controller method
  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

}
