import { Component, OnInit } from '@angular/core';
import {AUser} from "../../classes/a-user";
import {AuthenticationService} from "../../services/authentication.service";
import {CoursenseDataService} from "../../services/coursense-data.service";

@Component({
  selector: 'app-framework',
  templateUrl: './framework.component.html',
  styles: [],
})
export class FrameworkComponent implements OnInit {


  constructor(private authenticationService: AuthenticationService, private formService: CoursenseDataService) {}
  public logout(): void {
    this.authenticationService.logout();
  }
  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
  public getCurrentUser(): string {
    const user: AUser | null = this.authenticationService.getCurrentUser();
    return user ? user.name : "Guest";
  }

  newContact: ContactForm = {
    name: "",
    email: "",
    message: ""
  }

  resetForm() {
    this.newContact = {
      name: '',
      email: '',
      message: '',
    };
  }

  protected onSubmit(): void {
    this.formDataError = "";
    if (this.isFormDataValid()) {
      this.formService
          .contactForm(this.newContact)
          .subscribe({
            next: (contact: ContactForm) => {
              this.formDataError = "Email sent!";
              this.resetForm();
            },
            error: (err) => {
              this.formDataError = err || "Error sending email.";
            },
          });
    } else {
      this.formDataError =
          "All fields required, including a valid email address.";
    }
  }
  protected formDataError!: string;

  private isFormDataValid(): boolean {
    let isValid = false;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (
        this.newContact.name &&
        this.newContact.email &&
        this.newContact.message &&
        emailRegex.test(this.newContact.email)
    ) {
      isValid = true;
    }
    return isValid;
  }

  ngOnInit(): void {
  }

}

export class ContactForm {
  constructor(name: string, email: string, message: string) {
    this.name = name;
    this.email = email;
    this.message = message;
  }

  name!: string;
  email!: string;
  message!: string;
}