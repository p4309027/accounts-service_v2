import { Routes, RouterModule } from "@angular/router";

import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { UserAddressComponent } from "./user-address/user-address.component";
import { StaffComponent } from "./staff/staff.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";

// var userLogged = localStorage.getItem('token') !== null;
// var homePath = userLogged ? 'user-profile':'login';
// and below "redirectTo: homePath" was used instead of "redirectTo: 'login'"
// now this dynamic logic has been moved to inside of "ngOnInit()" function located in "LoginComponent"

const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'user-address', component: UserAddressComponent },
    { path: 'staff', component: StaffComponent },
    { path: '**', component: PageNotFoundComponent }
];

export const routing = RouterModule.forRoot(APP_ROUTES);