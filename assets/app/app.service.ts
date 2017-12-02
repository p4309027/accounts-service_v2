import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/add/operator/map';
import { Observable, Subject} from "rxjs";
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';


import { appConfig } from "./app-config";
import { UserModel } from "./models/user.model";
import { AddressModel } from "./models/address.model";

@Injectable()
export class AppService {
    jwtHelper: JwtHelper = new JwtHelper();
    //  RxJS Subject to allow the data to be multicasted to many Observers
    dataForSharing:Subject<any> = new Subject();

    constructor(private http: Http) {}

    shareData(data: string) {
        this.dataForSharing.next(data);
    }

    register(user: UserModel) {                
        const body = JSON.stringify(user);
        return this.http.post(appConfig.apiUrl + 'user/register', body, {headers: appConfig.header})
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    }

    login(user: UserModel) {
        const body = JSON.stringify(user);
        return this.http.post(appConfig.apiUrl + 'user/login', body, {headers: appConfig.header})
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    }

    getUserProfile(){
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.get(appConfig.apiUrl + 'user/user-profile' + token, {headers: appConfig.header})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                return Observable.throw(error.json());
            });
    }

    updateUserProfile(user: UserModel) {
        const body = JSON.stringify(user);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        return this.http.patch(appConfig.apiUrl + 'user/user-profile' + token, body, {headers: appConfig.header})
            .map((response: Response) => response.json())
            .catch(error => Observable.throw(error.json()));
    }

    getAddresses(){
        if (tokenNotExpired()){
            const token = '?token=' + localStorage.getItem('token');
            return this.http.get(appConfig.apiUrl + 'address' + token, {headers: appConfig.header})
                .map(response => <AddressModel[]> response.json())
                .catch(error => Observable.throw(error.json()));
        }
    };

    saveAddress(address: AddressModel){
        if (tokenNotExpired()){
            const body = JSON.stringify(address);
            const token = '?token=' + localStorage.getItem('token');
            return this.http.post(appConfig.apiUrl + 'address' + token, body, {headers: appConfig.header})
                .map(response => response.json())
                .catch(error => Observable.throw(error.json()));

        }
    };

    deleteAddress(address: AddressModel){
        const token = '?token=' + localStorage.getItem('token');
        return this.http.delete(appConfig.apiUrl + 'address' + '/' + address._id + token)
            .map(response => response.json())
            .catch(error => Observable.throw(error.json()));
    };

    logout() {
        localStorage.clear();
    }

    loggedIn(){
        return tokenNotExpired();
    }

    notLoggedIn(){
        if(localStorage.getItem('token') === null){
            return true;
        }else{
            return false;
        }
    }

    roleIs(){
        const token = localStorage.getItem('token');
        if (token){
            const role = this.jwtHelper.decodeToken(token).user.role;
            return role==="customer" ? true:false;
        }
    }
}