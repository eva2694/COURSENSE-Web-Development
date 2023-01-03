import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import { CoursenseDataService} from "../../services/coursense-data.service";


@Component({
    selector: 'app-search',
    templateUrl: 'search.component.html'
})
export class SearchComponent implements OnInit {
    courses: Course[] = [];
    @Input()
    enteredSearchValue: string = '';




    constructor(private searchDataService: CoursenseDataService) {}

    ngOnInit(): void {
        this.getCourses();
    }
    sort: string = "avg_rating";

    getCourses(): void {
        this.searchDataService
            .getCourses(1, 5, '', this.sort, this.enteredSearchValue).subscribe(object => {
            /*CONVERTING COURSES*/
            // @ts-ignore
            let objectArray = object["courses"]; //tip je Object[]
            // @ts-ignore
            let coursesArray = objectArray.map((course) => new Course(
                course._id,
                course.title,
                course.description,
                course.authors,
                course.price,
                course.language,
                course.category,
                course.keywords,
                course.image,
                course.accessURL,
                course.avg_rating
            ));
            /*CONVERTING COURSES*/
            if (coursesArray instanceof Array && coursesArray[0] instanceof Course) {
                this.courses = coursesArray;
            } else {
                throw Error("the returned values from API is not of type Array of Courses!!! the type of courses is: " + typeof coursesArray );
            }
        });

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
    accessURL?: string;
    avg_rating!: number;

    constructor(_id:string, title:string, description:string, authors:string[], price:number, language:string, catergory:string, keywords:string[], image:string, accessURL:string, avg_rating:number ) {
        this._id = _id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.price = price;
        this.language = language;
        this.category = catergory;
        this.keywords = keywords;
        this.image = image;
        this.accessURL = accessURL;
        this.avg_rating = avg_rating;
    }
}