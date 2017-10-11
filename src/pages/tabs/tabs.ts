import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { ChatPage } from '../chat/chat';

@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ContactPage;
  tab5Root = LoginPage;
  tab4Root = SignupPage;
  tab3Root = ChatPage;

  constructor() {

  }
}
