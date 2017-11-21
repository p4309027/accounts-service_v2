import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { AppService } from "../app.service";
import {ErrorService} from "../errors/error.service";
import { UserModel} from "../models/user.model";

@Component({
    selector: 'app-as-user-profile',
    templateUrl: "user-profile.component.html"
})

export class UserProfileComponent implements OnInit{
    userProfileForm: FormGroup;
    currentUser: any={}; 
    
    constructor(private appService: AppService, private router: Router, private errorService: ErrorService) {}
    
    onUpdate(){
        const updateUser = new UserModel(
            this.userProfileForm.value.email,
            this.userProfileForm.value.password,
            this.userProfileForm.value.firstName,
            this.userProfileForm.value.lastName
        );
        updateUser.role = "customer";
        this.appService.updateUserProfile(updateUser)
            .subscribe(
                data => this.errorService.handleError(data),
                error => this.errorService.handleError(error)
            );
    };

    ngOnInit(){

        this.userProfileForm = new FormGroup({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            email: new FormControl(),
            password: new FormControl('', Validators.required)
        });
        
        if (!this.appService.loggedIn()){
            return this.router.navigate(['login']);
        }
        
        this.appService.getUserProfile()
            .subscribe(
                user => this.currentUser=user.user,
                error => this.errorService.handleError(error)
            );

    };
}