import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AUser} from "../../classes/a-user";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../../../../assets/public/styles/signup.css']
})
export class SignupComponent implements OnInit {

  constructor(
      private router: Router,
      private authenticationService: AuthenticationService
  ) {}
  protected formError!: string;
  protected credentials: AUser = {
    name: "",
    email: "",
    password: "",
  };
  public header = {
    title: "Sign in",
    subtitle: "",
    sidebar: "",
  };
  public onLoginSubmit(): void {
    this.formError = "";
    if (
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
    else if (this.credentials.password.length < 3)
      this.formError = "Password must be at least 3 characters long.";
    else this.doLogin();
  }
  private doLogin(): void {
    this.authenticationService
        .login(this.credentials)
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
