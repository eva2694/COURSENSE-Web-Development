import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CreateProfileComponent} from "../shared/components/create-profile/create-profile.component";
import {HomeComponent} from "../shared/components/home/home.component";
import {ProfileComponent} from "../shared/components/profile/profile.component";
import {SignupComponent} from "../shared/components/signup/signup.component";
import {SearchComponent} from "../shared/components/search/search.component";
import {CoursesComponent} from "../shared/components/courses/courses.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "register", component: CreateProfileComponent },
  { path: "myprofile", component: ProfileComponent },
  { path: "login", component: SignupComponent},
  { path: "search", component: SearchComponent},
  { path: "courses/:courseId", component: CoursesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
