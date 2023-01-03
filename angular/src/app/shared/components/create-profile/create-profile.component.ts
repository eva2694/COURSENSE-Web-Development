import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {AUser} from "../../classes/a-user";
import {AuthenticationService} from "../../services/authentication.service";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-create-profile',
  template: `
<div class="login">
  <div id="form" class="container">
    <h1>Create a new Profile</h1>
    <form autocomplete="off" (ngSubmit)="onRegisterSubmit()">
      <div *ngIf="formError" class="form-group">
        <div class="alert alert-dark p-2 mt-4" role="alert">
          <i class="fas fa-exclamation-triangle pe-2"></i>{{ formError }}
        </div>
      </div>
      <div class="form-group">
        <label for="name" class="form-label mb-1">Full name</label>
        <input
            type="text"
            class="form-control form-control-sm"
            id="name"
            name="name"
            placeholder="Enter your name"
            [(ngModel)]="credentials.name"
        />
      </div>
      <div class="form-group">
        <label for="email" class="form-label mb-1 mt-3">E-mail address</label
        >
        <input
            type="text"
            class="form-control form-control-sm"
            id="email"
            name="email"
            placeholder="Enter e-mail address"
            [(ngModel)]="credentials.email"
        />
      </div>
      <div class="form-group">
        <label for="password" class="form-label mb-1 mt-3">Password</label>
        <input
            type="password"
            class="form-control form-control-sm"
            id="password"
            name="password"
            placeholder="Enter password"
            [(ngModel)]="credentials.password"
        />
      </div>
      <div class="form-group mt-3">
        <button type="submit" class="btn btn-sm btn-primary me-2">
          <i class="fa-regular fa-circle-check pe-2">Create Profile Now</i>
         </button>
      </div>  
    
    </form>
</div>
  </div>

  `,
  styleUrls: ['../../../../assets/public/styles/signup.css']
})
export class CreateProfileComponent implements OnInit {

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService
  ) {}
  formError!: string;
  credentials: AUser = {
    name: "",
    email: "",
    password: "",
  };
  public header = {
    title: "Create a new account",
    subtitle: "",
    sidebar: "",
  };

  public onRegisterSubmit(): void {

    this.formError = "";
    if (
        !this.credentials.name ||
        !this.credentials.email ||
        !this.credentials.password
    )
      this.formError = "All fields are required, please try again.";
    else if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
            this.credentials.email
        )
    )
      this.formError = "Please enter a valid e-mail address.";
    else if (this.credentials.password.length < 3) {
      this.formError = "Password must be at least 3 characters long.";
    }

    else {

      this.doRegister();
    }
  }

  private doRegister(): void {

    this.authenticationService
        .register(this.credentials)
        .pipe(
            catchError((error: HttpErrorResponse) => {
              this.formError = error.toString();
              return throwError(() => error);
            })
        )
        .subscribe(() => {
          this.router.navigateByUrl("/");
        });
  }

  ngOnInit(): void {
  }

}
