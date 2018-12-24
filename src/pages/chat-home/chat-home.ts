import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Events, Slides, IonicPage, NavParams, ToastController, Content } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder } from '@angular/forms';

import { ApiAuthService } from '../../services/apiAuthService';
import { ApiStorageService } from '../../services/apiStorageService';
import chatConfig from '../../assets/chat/chat-config';
import Log from '../../assets/log/log-debug';


var slideSelected = {
  home:0,
  chatting:1,
  create_group:2,
  setting:3,
}

@IonicPage()
@Component({
  selector: 'page-chat-home',
  templateUrl: 'chat-home.html'
})

export class ChatHomePage {
  @ViewChild(Slides) slides: Slides;

  slideIndex = 0;
  title = 'CHAT HOME';
  image_default='./assets/imgs/group.jpeg';

  nickname = '';
  message:string = '';

  user:any;
  authenticationServer:any;
  token:any;
  messages = [];
  room:any;
  session:any;
  rooms=[];
  last_time:number = new Date().getTime();
 
  //doc tu storage hoac server??
  temprooms = [
    {
      name:chatConfig.roomType+'Phong ban',
      messages:[]
    }
    ,
    {
      name:chatConfig.roomType+'Gia dinh',
      messages:[]
    }
    ,
    {
      name:chatConfig.roomType+'Ban be',
      messages:[]
    }
    ,
    {
      name:chatConfig.roomType+'Cong viec',
      messages:[]
    }
    ,
  ];

  //userRooms:any;
  
  unreadCount = 0;

  public addFromGroup: FormGroup;
  public contentMessages;

  constructor(private formBuilder: FormBuilder,
              private navParams: NavParams, 
              private navCtrl: NavController,
              private apiService: ApiAuthService,
              private events: Events,
              private apiStorage: ApiStorageService) {}

  ngOnInit() {
    
     console.log('ngOnInit() - chat-home.ts!', this.session);
     
    //  this.rooms = this.apiStorage.getUserRooms(this.user);
    //  if (this.rooms) this.rooms = this.temprooms; 

    this.addFromGroup = this.formBuilder.group({
      room_name:'',
      
    });



    this.getRoomChating().subscribe(data=>{
        console.log('Observerable sau 1 giay: ', data);
        //this.apiStorage.saveUserRooms(this.session.user,rooms);
    })
      

    //su dung truyen du lieu tu form a-->b ben fom b phai khai dung su kien thi moi
    this.events.publish(chatConfig.event_register_room,{data:'123'});
        

    //chuyen slide khi su kien click group
    //nguoc lai lang nghe su kien cua form khac truyen cho minh bang lenh 
    this.events.subscribe(chatConfig.event_change_room, ((data) => {
        console.log(data);
    }));      
      
      this.events.subscribe(chatConfig.event_chat_setting, (() => {
        this.goToSlide(slideSelected.setting);
      }));      

  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad', this.session);
   }

  ionViewWillLeave() {
    

    console.log('this.socket.disconnect()', this.session);
  }

  

  getRoomChating() {
    let observable = new Observable(observer => {
      setTimeout(()=>{
        observer.next({
          room_name: 'test'
        });
      },1000);
    });
    return observable;
  }

  
  

  /**
   * Dieu khien slide
   * @param i 
   */
  goToSlide(i) {
    this.slides.slideTo(i, 500);
    
  }

  /**
   * xac dinh slide
   */
  slideChanged() {
    this.slideIndex = this.slides.getActiveIndex();
  }

  formAddRoom(){
    this.goToSlide(2);
  }

  addRoom(){

  }
  
  listUnread(){
    
  }

  reset(){
    location.href= '/';
  }

  selectIcon(){
    //this.navCtrl.push(SampleIconsPage);
  }

  callSendLog(){
    Log.print();
    //Log.get(); -->for send
    Log.reset();
  }

  callLogout() {
    this.apiService.logout()
    .then(d=>{
      this.reset();
    })
    .catch(e=>{});
  }

}