import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatHomePage } from './chat-home';

@NgModule({
  declarations: [
    ChatHomePage
  ],
  imports: [
    IonicPageModule.forChild(ChatHomePage)
  ],
})
export class ChatHomePageModule {}
