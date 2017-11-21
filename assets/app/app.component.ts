import { Component } from '@angular/core';
import { AppService } from "./app.service";
import { Router } from "@angular/router";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(private appService: AppService, private router: Router) {}
    
        loggedIn() {
            return this.appService.loggedIn();
        }

        notLoggedIn() {
            return this.appService.notLoggedIn();
        }

        roleIs(){
            return this.appService.roleIs();
        }

        onLogout() {
            this.appService.logout();
            this.router.navigate(['login']);
        }
}