import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { CoursenseDataService} from "../../services/coursense-data.service";
import {ActivatedRoute, ParamMap } from "@angular/router";
import {switchMap } from "rxjs";
import { AuthenticationService } from "../../services/authentication.service";
import { AUser} from "../../classes/a-user";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['../../../../assets/public/styles/slog.css']
})
export class CoursesComponent implements OnInit {
  modalRef?: BsModalRef;

  constructor(
      private coursenseDataService: CoursenseDataService,
      private route: ActivatedRoute,
      private modalService: BsModalService,
      private authenticationService: AuthenticationService
  ) {}

  course!: Course;
  reviews!: Review;

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public getCurrentUser(): string {
    const user: AUser | null = this.authenticationService.getCurrentUser();
    return user ? user.name : "Guest";
  }

  protected openModal(form: TemplateRef<any>) {
    this.modalRef = this.modalService.show(form, {
      class: "modal-dialog-centered",
      keyboard: false,
      ignoreBackdropClick: true
    });
  }

  protected closeModal() {
    this.newReview = {
      _id: "",
      author: "",
      rating: 0,
      body: ""
    };
    this.formDataError = "";
    this.modalRef?.hide();
  }


  ngOnInit(): void {
    this.route.paramMap
        .pipe(
            switchMap((params: ParamMap) => {
              let courseId: string = params.get("courseId") || "";
              return this.coursenseDataService.getCourseDetails(courseId);
            })
        )
        .subscribe((course: Course) => {
          this.course = course;
        });
  }

  protected newReview: Review = {
    _id: "",
    author: "",
    rating: 0,
    body: ""
  };

  protected addNewReview(): void {
    this.formDataError = "";
    this.newReview.author = this.getCurrentUser()
    if (this.isFormDataValid()) {
      this.coursenseDataService
          .addReview(this.course._id, this.newReview)
          .subscribe({
            next: (review: Review) => {
              this.course?.reviews?.unshift(review);
              this.updateAverageRating();
              this.closeModal();
            },
            error: (err) => {
              this.formDataError = err || "Error adding review.";
            },
          });
    } else {
      this.formDataError =
          "All fields required, including rating between 1 and 5.";
    }
  }
  protected formDataError!: string;
  private isFormDataValid(): boolean {
    let isValid = false;
    if (
        this.newReview.rating &&
        this.newReview.body &&
        this.newReview.rating >= 1 &&
        this.newReview.rating <= 5
    ) {
      isValid = true;
    }
    return isValid;
  }

  public canDeleteReview(review: Review): boolean {
    return this.isLoggedIn() && this.getCurrentUser() === review.author;
  }

  protected deleteReview(reviewId: string | undefined): void {
    if (reviewId) {
      this.coursenseDataService
          .deleteReview(this.course._id, reviewId)
          .subscribe({
            next: () => {
              this.course.reviews = this.course.reviews?.filter(
                  (review) => review._id !== reviewId
              );
              this.updateAverageRating();
            },
            error: (err) => {
              console.log(err);
            },
          });
    }
  }

  private updateAverageRating(): void {
    if (this.course && this.course.reviews) {
      const count: number = this.course.reviews.length;
      const total: number = this.course.reviews.reduce((acc, { rating }) => {
        return acc + rating;
      }, 0);
      this.course.avg_rating = Math.floor(total / count);
    } else {
      this.course.avg_rating = 0;
    }
  }


  spellcheck() {
    if(this.newReview.body){
      this.coursenseDataService.checkSpelling(this.newReview.body)
          .subscribe({
        next: (text: string) => {
          this.formDataError = "Your review text has " + text + " errors!";
        },
        error: (err) => {
          this.formDataError = err || "Error spellchecking.";
        },
      });
    }
  }
}

export class Course {
  _id!: string;
  title!: string;
  description!: string;
  authors!: string[];
  price!: number;
  language!: string;
  category!: string;
  keywords!: string[];
  image?: string;
  reviews?: Review[];
  accessURL?: string;
  avg_rating!: number;
}

export class Review {
  _id!: string;
  author!: string;
  rating!: number;
  body!: string;
}


