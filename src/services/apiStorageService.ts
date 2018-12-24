import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService, isStorageAvailable } from 'angular-webstorage-service';
 
const STORAGE_KEY = 'Cng@3500888';
const sessionStorageAvailable = isStorageAvailable(sessionStorage); 

@Injectable()
export class ApiStorageService {
 
    public static token;
    public static authenticationServer = 'http://localhost:9235/api/auth';
    //public static authenticationServer = 'https://c3.mobifone.vn/api/auth';

    constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
    }
 
    public doSomethingAwesome(): number {
        const awesomenessLevel: number = this.storage.get(STORAGE_KEY) || 1337;
        this.storage.set(STORAGE_KEY, awesomenessLevel + 1);
        return awesomenessLevel;
    }

    private save(key,value){
        this.storage.set(key, value);
    }
    private read(key){
        return this.storage.get(key);
    }

    private delete(key){
        this.storage.remove(key);
    }

    getStatus(){
        return `Session storage available: ${sessionStorageAvailable}`;
    }

    saveToken(value){
        this.save('token',value);
    }

    getToken(){
       ApiStorageService.token = this.read('token');
       return ApiStorageService.token;
    }

    deleteToken(){
        ApiStorageService.token = null;
        this.delete('token');
    }

    saveUserRooms(user,rooms){
        this.save('#rooms#'+user.username,JSON.stringify(rooms));
    }

    deleteUserRooms(user){
        this.delete('#rooms#'+user.username);
    }

    getUserRooms(user){
        try{
            let rooms = JSON.parse(this.read('#rooms#'+user.username));
            return rooms?rooms:[];
        }catch(e){
            return [];
        }
    }

    saveUserLastTime(user,time:number){
        this.save('#last_time#'+user.username,time.toString());
    }

    deleteUserLastTime(user){
        this.delete('#last_time#'+user.username);
    }

    getUserLastTime(user){
        try{
            let time = parseInt(this.read('#last_time#'+user.username));
            return time;
        }catch(e){
            return 0;
        }
    }

    saveUserRoomMessages(user,room){
        this.save('#message'+room.name+'#'+user.username,JSON.stringify(room.messages));
        this.saveUserLastTime(user,new Date().getTime());
    }

    getUserRoomMessages(user,room){
        try{
            let messages = JSON.parse(this.read('#message'+room.name+'#'+user.username));
            return messages?messages:[];
        }catch(e){
            return [];
        }
    }

}