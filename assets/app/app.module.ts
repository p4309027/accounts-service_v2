import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { routing } from "./app.routing";
import { AppService } from "./app.service";
import { ErrorComponent } from "./errors/error.component";
import { ErrorService } from "./errors/error.service";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { UserAddressComponent } from "./user-address/user-address.component";
import { StaffComponent } from './staff/staff.component';
import { StaffService } from './staff/staff.service';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ErrorComponent,
        PageNotFoundComponent,
        LoginComponent,
        RegisterComponent,
        UserProfileComponent,
        UserAddressComponent,
        StaffComponent
    ],
    imports: [
        BrowserModule,
        routing,
        HttpModule,
        CommonModule,
        ReactiveFormsModule
    ],
    providers: [AppService, ErrorService, StaffService],
    bootstrap: [AppComponent]
})
export class AppModule {

}