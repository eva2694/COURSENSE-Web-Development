const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {Schema} = require("mongoose");

/*****************USER + PROFILE********************/
 const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required!"]
    },
    name: {
        type: String,
        required: [true, "Name is required!"]
    },
    hash: { type: String, required: [true, "Hash is required!"] },
    salt: { type: String, required: [true, "Salt is required!"] },
    profile: {

        firstName: { type: String },
        lastName: { type: String },
        bio: { type: String },
        occupation: { type: String },
    },
    userType: {
        type: String,
        enum: {
            values: [
                'User',
                'Reviwer',
                'Admin'
            ],
            message: "A specific user category required"
        },
        default: 'User',
        required: [true, "Category is required!"]
    },
});


userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
};

userSchema.methods.validPassword = function (password) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
        .toString("hex");
    return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            exp: parseInt(expiry.getTime() / 1000),
        },
        process.env.JWT_SECRET
    );
};
/**
 * @openapi
 * components:
 *  schemas:
 *   User:
 *    type: object
 *    description: Profile of a user
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>unique identifier</b> of user
 *      example: 635a62f5dc5d7968e68464be
 *     email:
 *      type: string
 *      description: <b>EMAIL</b> of the user
 *      example: lz223@gmail.com
 *     name:
 *      type: string
 *      description: <b>Name</b> of the user
 *      example: Luka Šinigoj
 *      password:
 *       type: string
 *       description: password of the user
 *       example: gesloosleg
 *     profile:
 *      type: object
 *      description: The outside seen profile values like  firstName, lastName, bio and occupation
 *      firstName:
 *       type: string
 *       description: The <b>first name</b> of the profile owner.
 *       example: Luka
 *      lastName:
 *       type: string
 *       description: The <b>last name</b> of the profile owner.
 *       example: Kumperscak
 *      bio:
 *       type: string
 *       description: The <b>bio</b> of the profile owner.
 *       example: Just a dude learning stuff.
 *      occupation:
 *       type: string
 *       description: The <b>occupation</b> of the profile owner.
 *       example: Plumber
 *     type:
 *      type: string
 *      enum:
 *       - User
 *       - Reviewer
 *       - Admin
 *    required:
 *     - email
 *     - name
 *     - type
 *    Authentication:
 *     description: Authentication token of the user.
 *     properties:
 *      token:
 *       type: string
 *       description: JWT token
 *       example: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NTZiZWRmNDhmOTUzOTViMTlhNjc1ODgiLCJlbWFpbCI6InNpbW9uQGZ1bGxzdGFja3RyYWluaW5nLmNvbSIsIm5hbWUiOiJTaW1vbiBIb2xtZXMiLCJleHAiOjE0MzUwNDA0MTgsImlhdCI6MTQzNDQzNTYxOH0.GD7UrfnLk295rwvIrCikbkAKctFFoRCHotLYZwZpdlE
 *     required:
 *     - token
 */


/*****************REVIEW********************/

const reviewSchema = new mongoose.Schema({

    author: { type: String, required: [true, "Author is required!"] },
    rating: {
        type: Number,
        //required: [true, "Rating is required!"],
        min: 0,
        max: 5,
    },
    body: {
        type: String
    },
    createdOn: { type: Date, default: Date.now }, //v json treba vpisat
});
/**
 * @openapi
 * components:
 *  schemas:
 *   Review:
 *    type: object
 *    description: A review of a course.
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>unique identifier</b> of review
 *      example: 635a62f5dc5d7968e68464be
 *     author:
 *      type: string
 *      description: <b>name of the author</b> of the review
 *      example: Lan Ošabni
 *     rating:
 *      type: integer
 *      description: <b>rating</b> of the course in the review
 *      minimum: 0
 *      maximum: 5
 *      example: 5
 *     body:
 *      type: string
 *      description: <b>The text</b> of the review
 *      example: Taught me all the things I shouldn't know.
 *     createdOn:
 *      type: string
 *      description: <b>date</b> of the review <b>creation</b>
 *      format: date-time
 *      example: 2020-12-25T17:43:00.000Z
 *    required:
 *     - _id
 *     - author
 */

/*****************COURSE********************/


const coursesSchema = new Schema({
    id: {
        type: Number,
        required: [true, "Unique identifier is required!"],
    },
    title: {
        type: String,
        required: [true, "Title is required!"]
    },
    description: {
        type: String,
        required: [true, "Description is required!"]
    },
    authors: {
        type: [String],
        required: true, "default": ["unknown author"]
    },
    price: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    language: {
        type: String,
        default: "Not listed",
        required: true
    },
    category: {
        type: String,
        enum: {
            values: [
                'Development',
                'Business',
                'Finance & Accounting',
                'IT & Software',
                'Office Productivity',
                'Personal Development',
                'Design',
                'Marketing',
                'Lifestyle',
                'Photography & Video',
                'Health & Fitness',
                'Music',
                'Teaching & Academics',
                'Other'
            ],
            message: 'A specific category required'
        },
        default: 'Other',
        required: [true, "Category is required!"]
    },
    keywords: {
        type: [String],
        validate: {
            validator: (v) => Array.isArray(v) && v.length > 0,
            message: "At least one keyword is required!",
        },
    },
    image: {
        type: String
    },
    accessURL: {
        type: String
    },

    avg_rating: {
        type: Number,
    },
    reviews: {
        type: [reviewSchema],
    },

    createdOn: { type: Date, default: Date.now },

});
/**
 * @openapi
 * components:
 *  schemas:
 *   Courses:
 *    type: object
 *    description: The course itself.
 *    properties:
 *     _id:
 *      type: string
 *      description: <b>unique identifier</b> of the course
 *      example: 635a62f5dc5d7968e68464be
 *     title:
 *      type: string
 *      description: <b>The title</b> of the course
 *      example: Tik Tok for dummies
 *     description:
 *      type: string
 *      description: The description of the course
 *      example: With this course we will be learning about the pitfalls of using tik tok, exploiting them and overcoming our initial problems.
 *     authors:
 *      type: string
 *      description: <b>Name</b> of the author.
 *      example: Zoomer Zoomerski
 *     price:
 *      type: integer
 *      description: <b>The price</b> of the course.
 *      example: 335
 *     language:
 *      type: string
 *      description: <b>The Language</b> of the course.
 *      example: english
 *     category:
 *      type: string
 *      description: <b>The category</b> of the course.
 *      example: Development
 *      enum:
 *       - Development
 *       - Business
 *       - Finance & Accounting
 *       - IT & Software
 *       - Office Productivity
 *       - Personal Development
 *       - Design
 *       - Marketing
 *       - Lifestyle
 *       - Photography & Video
 *       - Health & Fitness
 *       - Music
 *       - Teaching & Academics
 *       - Other
 *     keywords:
 *      type: array
 *      description: keywords describing the course
 *     image:
 *      type: string
 *      description: the image of the course.
 *     accessURL:
 *      type: string
 *      description: the URL used to find the Course at a vendor
 *     avg_rating:
 *      type: integer
 *      description: the average rating of a course
 *      example: 3
 *     reviews:
 *      type: array
 *      items:
 *       $ref: '#/components/schemas/reviews'
 *     createdOn:
 *      type: string
 *      description: <b>date</b> of the course <b>creation</b>
 *      format: date-time
 *      example: 2020-12-25T17:43:00.000Z
 *    required:
 *     - _id
 *     - title
 *     - description
 *     - authors
 *     - price
 *     - language
 *     - category
 *     - keywords
 */


//Prevajanje v model
const User = mongoose.model('User', userSchema, 'Users');
const Course = mongoose.model('Course', coursesSchema, 'Courses');

module.exports = {
    Course,
    User
};
