import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AppService } from "../app.service";
import {ErrorService} from "../errors/error.service";
import { UserModel} from "../models/user.model";

@Component({
    selector: 'app-as-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
    myForm: FormGroup;

    constructor(private appService: AppService, private router: Router, private errorService: ErrorService) {}

    onSubmit() {
        const user = new UserModel(
            this.myForm.value.email,
            this.myForm.value.password,
            this.myForm.value.firstName,
            this.myForm.value.lastName
        );

        user.role="customer";
        user.approved=false;
        
        this.appService.register(user)
            .subscribe(
                data => this.router.navigate(['login']),
                error => this.errorService.handleError(error)
            );
        this.myForm.reset();
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, Validators.required)
        });

        if (this.appService.loggedIn()){
            this.router.navigate(['user-profile']);
        };
    }
}