import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { JwtHelper } from 'angular2-jwt';

import { StaffService } from "./staff.service";
import { ErrorService } from "../errors/error.service";
import { UserModel } from "../models/user.model";

@Component({
    selector: 'app-as-staff',
    templateUrl: './staff.component.html'
})

export class StaffComponent  implements OnInit {
    customers: any[];
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private staffService: StaffService, private router: Router, private errorService:ErrorService){

    }

    // this is for checkbox
    handleChange(e, i) {
        e.target.value = e.target.checked;
        this.customers[i].approved=e.target.checked;
    }

    onUpdateStatus(customer){
        this.staffService.approve(customer)
            .subscribe(
                //data errorhandler is temporary service, it allows to use "errorHandler" service
                data => this.errorService.handleError(data),
                error => this.errorService.handleError(error)
            );
    }
    
    ngOnInit(){
        
        const token = localStorage.getItem('token');
        if (token!==null && this.staffService.loggedIn()){
            const role = this.jwtHelper.decodeToken(localStorage.getItem('token')).user.role;
            if (role !== "staff"){                
                this.router.navigate(['user-address']);
            }
        }else{
            localStorage.clear();
            this.router.navigate(['login']);
        }
        
        // get the list of customers
        if (this.staffService.loggedIn()){
            this.staffService.getCustomers()
            .subscribe(
                data => this.customers = data.users,
                error => this.errorService.handleError(error)
            );
        }

    }
}