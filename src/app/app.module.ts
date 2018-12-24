import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';


import { StorageServiceModule } from 'angular-webstorage-service';
import { ApiStorageService } from '../services/apiStorageService';

import { ApiAuthService } from '../services/apiAuthService';
import { ApiImageService } from '../services/apiImageService';
import { ApiChattingService } from '../services/apiChattingService';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from '../interceptors/requestInterceptor';
import { ResponseInterceptor } from '../interceptors/responseInterceptor';


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    StorageServiceModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ApiAuthService,
    ApiImageService,
    ApiStorageService,
    ApiChattingService,
    RequestInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler, 
      useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
