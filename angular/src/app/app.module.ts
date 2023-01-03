import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { ModalModule, BsModalService } from "ngx-bootstrap/modal";
import { RouterModule } from "@angular/router";
import { HomeComponent } from './shared/components/home/home.component';
import { FrameworkComponent } from './shared/components/framework/framework.component';
import { SearchComponent } from './shared/components/search/search.component';
import { CoursesComponent } from './shared/components/courses/courses.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { HttpClientModule} from "@angular/common/http";
import { SignupComponent } from './shared/components/signup/signup.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CreateProfileComponent } from './shared/components/create-profile/create-profile.component';

@NgModule({
  declarations: [
    HomeComponent,
    FrameworkComponent,
    SearchComponent,
    CoursesComponent,
    ProfileComponent,
    SignupComponent,
    CreateProfileComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ModalModule,
        HttpClientModule,
        RouterModule.forRoot([
            {path: "home", component: HomeComponent},
            {path: "search", component: SearchComponent},
            {path: "courses", component: CoursesComponent},
            {path: "profile", component: ProfileComponent},
            {path: "signup", component: SignupComponent},
            {path: "create-profile", component: CreateProfileComponent},
            {path: "courses/:courseId", component: CoursesComponent},
        ]),
        ReactiveFormsModule,
        FormsModule,
    ],
  providers: [BsModalService],
  bootstrap: [FrameworkComponent]
})
export class AppModule { }
