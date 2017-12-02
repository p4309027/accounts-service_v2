import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AppService } from "../app.service";
import {ErrorService} from "../errors/error.service";
import { UserModel} from "../models/user.model";

@Component({
    selector: 'app-as-login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    myForm: FormGroup;

    constructor(private appService: AppService, private router: Router, private errorService: ErrorService) {}

    onSubmit() {
        const user = new UserModel(this.myForm.value.email, this.myForm.value.password);
        this.appService.login(user)
            .subscribe(
                data => {
                    localStorage.setItem('token', data.token);
                    // localStorage.setItem('userId', data.userId);
                    // localStorage.setItem('userRole', data.userRole);
                    
                    this.appService.shareData(data.token);
                    
                    // check if the user staff, if true go to /staff
                    if(this.appService.roleIs()){
                        this.router.navigate([ 'user-profile']);
                    }else{
                        this.router.navigate([ 'staff']);
                    }
                },
                error => this.errorService.handleError(error)
            );
        this.myForm.reset();
    }

    ngOnInit() {

        localStorage.clear();

        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, Validators.required)
        });

        if (this.appService.loggedIn()){
            this.router.navigate(['user-profile']);
        }
    }
}