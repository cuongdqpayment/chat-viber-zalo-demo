import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import chatConfig from '../../assets/chat/chat-config';
import Log from '../../assets/log/log-debug';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              private events: Events
              ) { }

  ngOnInit() {
     //su dung truyen du lieu tu form a-->b ben fom b phai khai dung su kien thi moi
     this.events.subscribe(chatConfig.event_register_room, ((data) => {
      console.log(data);
      }));
        

     //chuyen slide khi su kien click group
     //nguoc lai lang nghe su kien cua form khac truyen cho minh bang lenh 
     this.events.publish(chatConfig.event_change_room,{data:'123'});    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Trang Home load xong');

    setTimeout(()=>{
      this.navCtrl.setRoot('ChatHomePage'), { 
        user:'abc',
        token: 'chuoi gi do'
      };
    },3000);

   }

}
