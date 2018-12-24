import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiStorageService } from './apiStorageService';

import { RequestInterceptor } from '../interceptors/requestInterceptor';

import 'rxjs/add/operator/map'

import NodeRSA from 'node-rsa';
import jwt from 'jsonwebtoken';

@Injectable()
export class ApiAuthService {

    public authenticationServer = ApiStorageService.authenticationServer;
    public clientKey = new NodeRSA({ b: 512 }, { signingScheme: 'pkcs1-sha256' }); //for decrypte
    public midleKey = new NodeRSA(null, { signingScheme: 'pkcs1-sha256' }); //for test
    public serverKey = new NodeRSA(null, { signingScheme: 'pkcs1-sha256' }); //for crypte
    public publicKey: any;
    public userToken: any;
    public userSetting: any;
    public userInfo: any;


    constructor(private httpClient: HttpClient,
                private apiStorageService: ApiStorageService,
                private reqInterceptor: RequestInterceptor) {
        //key nay de test thu noi bo
        this.midleKey.importKey(this.clientKey.exportKey('public'));
    }

    getServerPublicRSAKey() {
        //console.log('get Public key');
        if (this.publicKey && this.publicKey.PUBLIC_KEY) {
            //console.log('Public key from in session');
            return (new Promise((resolve, reject) => {
                try {
                    this.serverKey.importKey(this.publicKey.PUBLIC_KEY);
                } catch (err) {
                    reject(err); //bao loi khong import key duoc
                }
                resolve(this.serverKey);
            }));
            
        } else {
            //console.log('get Public key from server');
            return this.httpClient.get(this.authenticationServer + '/key-json')
            .toPromise()
            .then(jsonData => {
                this.publicKey = jsonData;
                    //console.log('co tra ve');
                    if (this.publicKey && this.publicKey.PUBLIC_KEY) {
                        try {
                            this.serverKey.importKey(this.publicKey.PUBLIC_KEY);
                        } catch (err) {
                            throw err;
                        }
                        return this.serverKey;
                    } else {
                        throw new Error('No PUBLIC_KEY exists!');
                    }
                })
            ;
        }
    }

    login(formData) {
        this.reqInterceptor.setRequestToken(null); //login nguoi khac
        return this.httpClient.post(this.authenticationServer + '/login', formData)
            .toPromise()
            .then(data => {
                this.userToken = data;
                this.reqInterceptor.setRequestToken(this.userToken.token); //login nguoi khac
                return this.userToken.token;
            });
        }
        
    logout() {

        //xoa bo token luu tru
        this.apiStorageService.deleteToken();

        if (this.userToken && this.userToken.token) {
                //truong hop user co luu tren session thi xoa session di
            this.reqInterceptor.setRequestToken(this.userToken.token); //login nguoi khac
            return this.httpClient.get(this.authenticationServer + '/logout')
                .toPromise()
                .then(data => {
                    //console.log(data);
                    this.userToken = null; //reset token nay
                    this.reqInterceptor.setRequestToken(null);
                    return true; //tra ve nguyen mau data cho noi goi logout xu ly
                })
                .catch(err => {
                    //xem nhu da logout khong cap luu tru
                    //console.log(err);
                    this.reqInterceptor.setRequestToken(null);
                    this.userToken = null; //reset token nay
                    return true; //tra ve nguyen mau data cho noi goi logout xu ly
                });
        } else {
            return (new Promise((resolve, reject) => {
                resolve(true);
            }));

        }
    }

    register(formData) {
        return this.httpClient.post(this.authenticationServer + '/register', formData)
            .toPromise()
            .then(data => {
                return data;
            });

    }

    editUser(formData) {
        //them token vao truoc khi edit
        this.reqInterceptor.setRequestToken(this.userToken.token);
        return this.httpClient.post(this.authenticationServer + '/edit', formData)
            .toPromise()
            .then(data => {
                return data;
            });

    }
    //lay thong tin nguoi dung de edit
    getEdit() {
        if (this.userToken && this.userToken.token) {
            //them token vao truoc khi edit
            this.reqInterceptor.setRequestToken(this.userToken.token);
            return this.httpClient.get(this.authenticationServer + '/get-user')
                .toPromise()
                .then(jsonData => {
                    this.userSetting = jsonData;
                    return jsonData;
                });
        } else {
            return (new Promise((resolve, reject) => {
                this.userSetting = null;
                reject({ error: 'No token, please login first' }); //bao loi khong import key duoc
            }));
        }
    }
    
    //get userInfo from token
    getUserInfo() {
        //this.userInfo=null;
        try {
            this.userInfo = jwt.decode(this.userToken.token);
            //console.log(this.userInfo);
            //chuyen doi duong dan image de truy cap anh dai dien
            if (this.userInfo.image
                &&
                this.userInfo.image.toLowerCase()
                &&
                this.userInfo.image.toLowerCase().indexOf('http://') < 0
                &&
                this.userInfo.image.toLowerCase().indexOf('https://') < 0) {
                //chuyen doi duong dan lay tai nguyen tai he thong
                this.userInfo.image = this.authenticationServer
                    + '/get-avatar/'
                    + this.userInfo.image
                    + '?token=' + this.userToken.token;
                //console.log(this.userInfo.image);
            }
        } catch (err) {
            this.userInfo = null;
        }
        return this.userInfo;
    }

    getUserInfoSetting() {
        if (this.userSetting.URL_IMAGE
            &&
            this.userSetting.URL_IMAGE.toLowerCase()
            &&
            this.userSetting.URL_IMAGE.toLowerCase().indexOf('http://') < 0
            &&
            this.userSetting.URL_IMAGE.toLowerCase().indexOf('https://') < 0) {
            //chuyen doi duong dan lay tai nguyen tai he thong
            this.userSetting.URL_IMAGE = this.authenticationServer
                + '/get-avatar/'
                + this.userSetting.URL_IMAGE
                + '?token=' + this.userToken.token;
            //console.log(this.userSetting.URL_IMAGE);
        }
        return this.userSetting;
    }

    /**
     * Thiet lap token tu local xem nhu da login
     * @param token 
     */
    /* pushToken(token){
        //gan token cho user de xem nhu da login
        this.userToken={token:token};
    } */


    /**
     * Gui len server kiem tra token co verify thi tra ve token, khong thi khong ghi 
     * @param token 
     */
    authorize(token){
        this.reqInterceptor.setRequestToken(token); //login nguoi khac
        return this.httpClient.get(this.authenticationServer + '/authorize')
            .toPromise()
            .then(data => {
                //console.log(data);                
                this.userToken={token:token};
                return true; 
            })
            .catch(err => {
                //console.log(err);
                return false; 
            });
    }

}