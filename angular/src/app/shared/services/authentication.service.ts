import { Inject, Injectable } from "@angular/core";
import {BROWSER_STORAGE} from "../classes/storage";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AUser} from "../classes/a-user";
import { AuthResponse} from "../classes/auth-response";
import { CoursenseDataService} from "./coursense-data.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(
      @Inject(BROWSER_STORAGE) private storage: Storage,
      private coursenseDataService: CoursenseDataService
  ) {}
  public login(user: AUser): Observable<AuthResponse> {
    return this.coursenseDataService.login(user).pipe(
        tap((authResponse: AuthResponse) => {
          this.saveToken(authResponse.token);
        })
    );
  }
  public register(user: AUser): Observable<AuthResponse> {
    console.log("registriramo se");
    return this.coursenseDataService.register(user).pipe(
        tap((authResponse: AuthResponse) => {
          console.log("shranimo token");
          this.saveToken(authResponse.token);
        })
    );
  }
  public logout(): void {
    this.storage.removeItem("coursense-token");
  }
  public getToken(): string | null {
    return this.storage.getItem("coursense-token");
  }
  public saveToken(token: string): void {
    this.storage.setItem("coursense-token", token);
  }

  public isLoggedIn(): boolean {
    const token: string | null = this.getToken();
    if (token) {
      const payload = JSON.parse(window.atob(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    } else return false;
  }

  public getCurrentUser(): AUser | null {
    let user!: AUser;
    if (this.isLoggedIn()) {
      let token: string | null = this.getToken();
      if (token) {
        let { email, name } = JSON.parse(window.atob(token.split(".")[1]));
        user = { email, name };
      }
    }
    return user;
  }

}
