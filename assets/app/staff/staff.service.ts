import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs";
import { tokenNotExpired } from 'angular2-jwt';


import { appConfig } from "../app-config";
import { UserModel } from "../models/user.model";

@Injectable()
export class StaffService {

    constructor(private http: Http) {}

    getCustomers(){
        if (tokenNotExpired()){
            const token = '?token=' + localStorage.getItem('token');
            return this.http.get(appConfig.apiUrl + 'staff' + token, {headers: appConfig.header})
                .map(response => <UserModel[]> response.json())
                .catch(error => Observable.throw(error.json()));
        }
    };

    approve(customer){
        const body = JSON.stringify(customer);
        const token = '?token=' + localStorage.getItem('token');
        return this.http.patch(appConfig.apiUrl + 'staff' + token, body, {headers: appConfig.header})
             .map(response => response.json())
             .catch(error => Observable.throw(error.json()));
    }

    loggedIn(){
        return tokenNotExpired();
    }

}