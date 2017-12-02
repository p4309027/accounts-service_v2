import { Component } from "@angular/core";
import { JwtHelper } from 'angular2-jwt';
import { AppService } from "../app.service";

@Component({
    selector: 'app-as-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    jwtHelper: JwtHelper = new JwtHelper();
    email:String = '';
    
    constructor(private appService: AppService) {
        this.appService.dataForSharing.subscribe(
            data => {
                const token = data;
                this.email = this.jwtHelper.decodeToken(token).user.email;
            }
        );
    }
	
}