import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, retry, tap} from "rxjs/operators";
import {Course , Review} from "../components/courses/courses.component";
import {Profile, User} from "../components/profile/profile.component";
import {AUser} from "../classes/a-user";
import {AuthResponse} from "../classes/auth-response";
import {environment} from "../../../environments/environment";
import {BROWSER_STORAGE} from "../classes/storage";
import {ContactForm} from "../components/framework/framework.component";



@Injectable({
  providedIn: 'root'
})
export class CoursenseDataService {
  constructor(
      private http: HttpClient,
      @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  private apiUrl = environment.apiUrl;

/*AUTHENTICATION*/
  public login(user: AUser): Observable<AuthResponse> {
    return this.makeAuthApiCall("login", user);
  }
  public register(user: AUser): Observable<AuthResponse> {

    return this.makeAuthApiCall("register", user);
  }
  private makeAuthApiCall(
      urlPath: string,
      user: AUser
  ): Observable<AuthResponse> {

    const url: string = `${this.apiUrl}/${urlPath}`;
    let body = new HttpParams().set("email", user.email).set("name", user.name);
    if (user.password) body = body.set("password", user.password);
    let headers = new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
    );


    return this.http
        .post<AuthResponse>(url, body, { headers:headers })
        .pipe(retry(1), catchError(this.handleError),
            tap(response => {
              const token = response.token;
              this.storage.setItem("cousense-token", token);
            })
        );
  }
/*COURSES & REVIEWS*/
  getCourses(page:number, limit:number, category:string, sort:string, search:string) {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('limit', limit);
    params = params.append('category', category);
    params = params.append('sort', sort);
    params = params.append('search', search);

    return this.http.get(`${this.apiUrl}/courses`, { params });
  }

  public getCourseDetails(courseId: string): Observable<Course> {
    const url: string = `${this.apiUrl}/courses/${courseId}`;
    return this.http
        .get<Course>(url)
        .pipe(retry(1), catchError(this.handleError));
  }
  public addReview(
      courseId: string,
      review: Review
  ): Observable<Review> {
    const url: string = `${this.apiUrl}/courses/${courseId}/reviews`;
    let body = new HttpParams()
        .set("author", review.author)
        .set("rating", review.rating)
        .set("body", review.body);
    let headers = new HttpHeaders()
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("Authorization", `Bearer ${this.storage.getItem("coursense-token")}`);
    return this.http
        .post<Review>(url, body, { headers })
        .pipe(retry(1), catchError(this.handleError));
  }

  public checkSpelling(text: string): Observable<string> {
    const url: string = `${this.apiUrl}/spellcheck`;
    let body = new HttpParams()
        .set("text", text)
    let headers = new HttpHeaders()
        .set("Content-Type", "application/x-www-form-urlencoded")
        .set("Authorization", `Bearer ${this.storage.getItem("coursense-token")}`);
    return this.http
        .post<string>(url, body, { headers })
        .pipe(retry(1), catchError(this.handleError));

  }

  public deleteReview(
      courseId: string,
      reviewId: string
  ): Observable<any> {
    const url: string = `${this.apiUrl}/courses/${courseId}/reviews/${reviewId}`;
    let headers = new HttpHeaders().set(
        "Authorization",
        `Bearer ${this.storage.getItem("coursense-token")}`
    )
    return this.http
        .delete(url, {headers}).pipe(retry(1), catchError(this.handleError));
  }
/*USER & PROFILE*/
  public getUserByName(name: string): Observable<Object> {
    const url: string = `${this.apiUrl}/profile/getId/${name}`;
    return this.http
        .get<Object>(url)
        .pipe(retry(1), catchError(this.handleError));
  }

  public getUser(profileId: string): Observable<User> {
    const url: string = `${this.apiUrl}/profile/${profileId}`;
    return this.http
        .get<User>(url)
        .pipe(retry(1), catchError(this.handleError));
  }

  public editProfile(profileId: string, profile: Profile): Observable<Profile> {
    const url: string = `${this.apiUrl}/profile/${profileId}`;

    const profile2 = new Profile(profile.firstName, profile.lastName, profile.bio, profile.occupation);
    let headers = new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${this.storage.getItem("coursense-token")}`);

    return this.http
        .put<Profile>(url, profile2, { headers })
        .pipe(
            retry(1),
            catchError((error) => {
              console.error(`Error editing profile: ${error}`);
              return throwError(error);
            })
        );
  }
/*CONTACT*/
  public contactForm(form: ContactForm): Observable<ContactForm>{
    const url: string = `${this.apiUrl}/contact`;
    const form2 = new ContactForm(form.name, form.email, form.message);
    let headers = new HttpHeaders()
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${this.storage.getItem("coursense-token")}`);

    return this.http
        .post<ContactForm>(url, form2, { headers })
        .pipe(
            retry(1),
            catchError((error) => {
              console.error(`Error editing profile: ${error}`);
              return throwError(error);
            })
        );
  }


  private handleError(error: HttpErrorResponse) {
    return throwError(() => error.error.message || error.statusText);
  }
}

