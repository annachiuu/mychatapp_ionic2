import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ContactPage } from '../pages/contact/contact';
import { ChatPage } from '../pages/chat/chat';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAQScVmyUu2mQzp-JP2BQUfnsVhxnw1ZeE",
    authDomain: "mychatapp-ab684.firebaseapp.com",
    databaseURL: "https://mychatapp-ab684.firebaseio.com",
    projectId: "mychatapp-ab684",
    storageBucket: "mychatapp-ab684.appspot.com",
    messagingSenderId: "382680600775"
  };
  // firebase.initializeApp(config);


@NgModule({
  declarations: [
    MyApp,
    SignupPage,
    LoginPage,
    ContactPage,
    ChatPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignupPage,
    LoginPage,
    ContactPage,
    ChatPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
