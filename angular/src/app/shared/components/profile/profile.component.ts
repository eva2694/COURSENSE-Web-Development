import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import {CoursenseDataService} from "../../services/coursense-data.service";
import {AUser} from "../../classes/a-user";
import {AuthenticationService} from "../../services/authentication.service";
import * as cluster from "cluster";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['../../../../assets/public/styles/editProfile.css']
})
export class ProfileComponent implements OnInit {

    // @ts-ignore
    user: User;
    users: User[] = [];
    modalRef?: BsModalRef;


    constructor(
        private userService: CoursenseDataService,
        private modalService: BsModalService,
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {}
    getProfileID(callback: (id: string) => void) {

        const name: string = this.getCurrentUser();
        if(name == "Guest") {
            callback("639bb73f06fbc739236366d8");
        } else {
            this.userService.getUserByName(name).subscribe(
                (response: Object) => {
                    // @ts-ignore
                    const id = response.id;
                    callback(id);
                },
                (error) => {
                    console.error(error);
                }
            );
        }
    }

    protected openModal(form: TemplateRef<any>) {
        this.modalRef = this.modalService.show(form, {
            class: "modal-dialog-centered",
            keyboard: false,
            ignoreBackdropClick: true
        });
    }

    protected closeModal() {
        this.modalRef?.hide();
    }


    // @ts-ignore
    public getCurrentUser(): string {
        const thisUser: AUser | null = this.authService.getCurrentUser();
        if(thisUser)return thisUser.name;
        else return "Guest";
    }
    // @ts-ignore
    editProfileForm: FormGroup;


    ngOnInit() {

        if(this.authService.isLoggedIn()) {
            this.getProfileID((id) => {
                let profileId: string = id;

                this.userService.getUser(profileId)
                    .subscribe(userData => {

                        // @ts-ignore
                        let newUser:User;
                        if(userData.profile) {
                            newUser = new User(
                                userData._id,
                                userData.email,
                                userData.name,
                                userData.hash,
                                userData.salt,
                                userData.userType,
                                new Profile(userData.profile.firstName, userData.profile.lastName, userData.profile.bio, userData.profile.occupation)
                            );
                        } else {
                            newUser = new User(
                                userData._id,
                                userData.email,
                                userData.name,
                                userData.hash,
                                userData.salt,
                                userData.userType,
                                new Profile("No first name set", "No last name set", "No bio  set", "No  occupation set")
                            );
                        }



                        if (newUser instanceof User) {
                            this.user = newUser;
                        } else {
                            throw Error("the returned values from API is not of type User!!! the type of courses is: " + typeof newUser );
                        }
                    });
            });
            //edit profile
            this.editProfileForm = this.formBuilder.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                bio: ['', Validators.required],
                occupation: ['', Validators.required]
            });



        }

    }

    onSubmit() {

        const formData = this.editProfileForm.value;
        const newProfile = new Profile(formData.firstName, formData.lastName, formData.bio, formData.occupation);
        this.userService.editProfile(this.user._id, newProfile).subscribe(
            (response) => {
                console.log(`Successfully edited profile: ${response}`);
                this.editProfileForm.reset();
            },
            (error) => {
                console.error(`Error editing profile: ${error}`);
            }
        );
    }

    //konec edit profile
}

export class User{
    _id!: string;
    email!: string;
    name!: string;
    hash!: string;
    salt!: string;
    profile!: Profile;
    userType!: string;//novo

    constructor(_id:string, email:string, name:string, hash:string, salt:string, userType:string, profile: Profile ) {//novo
        this._id = _id;
        this.email = email;
        this.name = name;
        this.hash = hash;
        this.salt = salt;
        this.userType = userType;
        this.profile = profile;

    }


}

export class Profile{

    firstName?: string;
    lastName?:string;
    bio?: string;
    occupation?: string;

    constructor(firstName: string | undefined, lastName: string | undefined, bio: string | undefined, occupation: string | undefined) {//novo
        this.firstName = firstName;
        this.lastName = lastName;
        this.bio = bio;
        this.occupation = occupation;
    }
}
