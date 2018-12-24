
import { Injectable } from '@angular/core';

@Injectable()
export class ApiChattingService {
    session:any;
    constructor(){}
    setting(session){
        this.session = session;
    }
    getSession(){
        return this.session;
    }
}