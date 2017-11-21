import { AppService } from './../app.service';
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms/src/model";
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { JwtHelper } from 'angular2-jwt';
import { AddressModel } from '../models/address.model';
import { ErrorService } from "../errors/error.service";

@Component({
    selector: 'app-as-user-address',
    templateUrl: './user-address.component.html'
})

export class UserAddressComponent implements OnInit{
    addressForm: FormGroup;
    addresses: AddressModel[];
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private appService: AppService, private router: Router, private errorService: ErrorService){}

    onSaveAddress(){
        this.addressForm.value.userId = this.jwtHelper.decodeToken(localStorage.getItem('token')).user._id;
        this.appService.saveAddress(this.addressForm.value)
            .subscribe(
                data => {
                    const address = new AddressModel(
                        data.obj.houseNumber,
                        data.obj.street,
                        data.obj.city,
                        data.obj.postcode,
                        data.obj.user._id,
                        data.obj._id
                    );
                    this.addresses.push(address);
                    this.addressForm.reset();
                    //this is temporary service, it allows to use "errorHandler" service
                    this.errorService.handleError(data);
                },
                error => this.errorService.handleError(error)
            );
    };

    onAddressDelete(address: AddressModel){
        this.appService.deleteAddress(address)
            .subscribe(
                data => {
                    //this is temporary service, it allows to use "errorHandler" service
                    this.errorService.handleError(data),
                    this.addresses.splice(this.addresses.indexOf(address), 1);
                },
                error => this.errorService.handleError(error)
            );            
    }

    ngOnInit(){

        this.addressForm = new FormGroup({
            houseNumber: new FormControl('', [
                Validators.required,
                Validators.pattern("^\\d+/?\\d*[a-zA-Z]?(?<!/)$")
            ]),
            street: new FormControl('', Validators.required),
            city: new FormControl('', Validators.required),
            postcode: new FormControl('', [
                Validators.required,
                Validators.pattern("((?:(?:gir)|(?:[a-pr-uwyz])(?:(?:[0-9](?:[a-hjkpstuw]|[0-9])?)|(?:[a-hk-y][0-9](?:[0-9]|[abehmnprv-y])?)))) ?([0-9][abd-hjlnp-uw-z]{2})")
            ])
        });

        if (this.appService.loggedIn()){
            this.appService.getAddresses()
            .subscribe(
                data => this.addresses = data.addresses,
                error => this.errorService.handleError(error)
            );
        }

        if (!this.appService.loggedIn()){
            this.router.navigate(['login']);
        }

    };
}