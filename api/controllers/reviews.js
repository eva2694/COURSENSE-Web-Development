const mongoose = require("mongoose");
const {Course} = require("../models/schemas");
const {User} = require("../models/schemas");

const reviewDetails = (req, res) => {
    Course.findById(req.params.courseId)
        .select("name reviews")
        .exec((err, course) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else if (!course) {
                res.status(404).json({
                    message:
                        "No Course with id: '" + req.params.courseId + "' found.",
                });
            } else if (course.reviews && course.reviews.length > 0) {

                let review = course.reviews.id(req.params.reviewId);
                if (!review) {
                    res.status(404).json({
                        message:
                            "No Review with id: '" + req.params.reviewId + "' found.",
                    });
                } else {

                    res.status(200).json({
                        course: {
                            _id: req.params.courseId,
                            title: course.title,
                        },
                        review: review,
                        status: "OK"
                    });
                }
            } else {
                res.status(404).json({ message: "No reviews found." });
            }
        });
};
/**
 * @openapi
 * /courses/{courseId}/reviews/{reviewId}:
 *  get:
 *   summary: Retrieve a specific review of a given course.
 *   description: Retrieve details of a **review** of a course.
 *   tags: [Reviews]
 *   parameters:
 *    - name: courseId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      required: true
 *      description: <b>unique identifier</b> of a course
 *      example: 635a62f5dc5d7968e6846574
 *    - name: reviewId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      required: true
 *      description: <b>unique identifier</b> of a review
 *      example: 635a62f5dc5d7968e68464be
 *   responses:
 *    '200':
 *     description: <b>OK</b>, with course details.
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         course:
 *          type: object
 *          properties:
 *           _id:
 *            type: string
 *            description: <b>unique identifier</b> of a course
 *            example: 635a62f5dc5d7968e6846574
 *           title:
 *            type: string
 *            description: <b>title</b> of the course
 *            example: Tik tok how to
 *         review:
 *          $ref: '#/components/schemas/review'
 *    '404':
 *     description: <b>Not Found</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        course not found:
 *         value:
 *          message: "Course with id '73512fc5022f6bd9e0dfe53e' not found."
 *        review not found:
 *         value:
 *          message: "Review with id '1' not found."
 *        no reviews found:
 *         value:
 *          message: "No reviews found."
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */


const reviewCreate = (req, res) => {
    getAuthor(req, res, (req, res, author) => {
        const courseId = req.params.courseId;

        if (courseId) {
            Course.findById(courseId)
                .select("reviews")
                .exec((err, course) => {
                    if (err) {
                        res.status(500).json({message: err.message});
                    } else {
                        addReview(req, res, course, author.name);
                    }

                });
        } else {
            res.status(400).json({
                message: "URL parameter 'courseId' is required.",
            });
        }
    });
};
/**
 * @openapi
 * /courses/{courseID}/reviews:
 *  post:
 *   summary: Add a new review to a given course.
 *   description: Add a new **review** with author's name, rating and review's content to a course with given unique identifier.
 *   tags: [Reviews]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: courseId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>unique identifier</b> of a course
 *      required: true
 *      example: 635a62f5dc5d7968e6846914
 *   requestBody:
 *    description: Review's author, rating and content.
 *    required: true
 *    content:
 *     application/x-www-form-urlencoded:
 *      schema:
 *       type: object
 *       properties:
 *        rating:
 *         type: integer
 *         description: <b>rating</b> of review
 *         minimum: 1
 *         maximum: 5
 *         enum: [1, 2, 3, 4, 5]
 *         example: 3
 *        body:
 *         type: string
 *         description: <b>content</b> of the review
 *         example: Srednja žalost jezus kristus.
 *       required:
 *        - rating
 *        - comment
 *   responses:
 *    '201':
 *     description: <b>Created</b>, with review details.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/review'
 *    '400':
 *     description: <b>Bad Request</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        courseId is required:
 *         value:
 *          message: Path parameter 'courseId' is required.
 *        author, rating and comment are required:
 *         value:
 *          message: Body parameters 'author', 'rating' and 'comment' are required.
 *    '401':
 *     description: <b>Unauthorized</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        no token provided:
 *         value:
 *          message: No authorization token was found.
 *        user not found:
 *         value:
 *          message: User not found.
 *        malformed token:
 *         value:
 *          message: jwt malformed
 *        invalid token signature:
 *         value:
 *          message: invalid signature
 *    '404':
 *     description: <b>Not Found</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Course with id '735a62f5dc5d7968e68467e3' not found.
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */
const getAuthor = (req, res, cbResult) => {
    if (req.auth && req.auth.email) {
        User.findOne({ email: req.auth.email }).exec((err, user) => {
            if (err) res.status(500).json({ message: err.message });
            else if (!user) res.status(401).json({ message: "User not found." });
            else cbResult(req, res, user);
        });
    }
};

const addReview = (req, res, course, author) => {
    if (!course) {
        res.status(404).json({
            message: "No course with id '" + req.params.courseId + "' found.",
        });
    } else {
        if (!req.body.rating) {
            res.status(400).json({
                message:
                    "Parameter rating required",
            });
        } else {
            course.reviews.push({
                author: author,
                rating: req.body.rating,
                body: req.body.body,
            });

            course.save((err, course) => {
                if (err) {
                    res.status(500).json({ message: err.message });
                } else {
                    averageRating(course._id);
                    res.status(201).json(course.reviews.slice(-1).pop());
                }
            });
        }
    }
};

const averageRating = (courseId) => {
    Course.findById(courseId)
        .select("avg_rating reviews")
        .exec((err, course) => {
            if (!err) averageRatingCalculate(course);
            else console.log(err);
        });
};

const averageRatingCalculate = (course) => {
    if (course.reviews && course.reviews.length > 0) {
        let numReviews = course.reviews.length;
        let sumReviews = 0;
        for(let i = 0; i < course.reviews.length; i++) {
            if(course.reviews[i].rating === undefined) {
                console.log("The review rating from review with index" + i + "is undefined");
                numReviews--;
                continue;
            }
            sumReviews+=course.reviews[i].rating;
        }

        course.avg_rating = parseInt(sumReviews / numReviews, 10);
    } else {
        course.avg_rating = 0;
    }
    course.save((err) => {
        if (err) console.log(err);
        else console.log("Average rating updated");
    });
};


const reviewDelete = (req, res) => {
    const { courseId, reviewId } = req.params;
    if (!courseId || !reviewId) {
        res.status(400).json({
            message: "All path parameters are required.",
        });
    } else {
        Course.findById(courseId)
            .select("reviews")
            .exec((err, course) => {
                if (err) res.status(500).json({ message: err.message });
                else if (!course)
                    res.status(404).json({
                        message: "No course with id '" + courseId + "' found.",
                    });
                else {
                    if (course.reviews && course.reviews.length > 0) {
                        const review = course.reviews.id(reviewId);
                        if (!review)
                            res.status(404).json({
                                message: "No review with id '" + reviewId + "' found.",
                            });
                        else {
                            getAuthor(req, res, (req, res, author) => {
                                if (review.author != author.name) {
                                    res.status(403).json({
                                        message: "Not authorized to delete this comment.",
                                    });
                                } else {
                                    review.remove();
                                    course.save((err, course) => {
                                        if (err) {
                                            console.log(err);
                                            res.status(500).json({message: err.message});
                                        } else {
                                            averageRating(course._id);
                                            res.status(204).send();
                                        }
                                    });
                                }
                            });
                        }
                    } else {
                        res.status(404).json({ message: "No reviews found." });
                    }
                }
            });
    }
};

/**
 * @openapi
 * /courses/{courseID}/reviews/{reviewId} :
 *  delete:
 *   summary: Delete existing review from a given location.
 *   description: Delete existing **review** with a given unique identifier from a course with given unique identifier.
 *   tags: [Reviews]
 *   security:
 *    - jwt: []
 *   parameters:
 *    - name: courseId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>unique identifier</b> of course
 *      required: true
 *      example: 635a62f5dc5d7968e6846914
 *    - name: reviewId
 *      in: path
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      description: <b>unique identifier</b> of review
 *      required: true
 *      example: 636346e7171e084ff4e4bbf9
 *   responses:
 *    '204':
 *     description: <b>No Content</b>, with no content.
 *    '400':
 *     description: <b>Bad Request</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: All path parameters are required.
 *    '401':
 *     description: <b>Unauthorized</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        no token provided:
 *         value:
 *          message: No authorization token was found.
 *        user not found:
 *         value:
 *          message: User not found.
 *        malformed token:
 *         value:
 *          message: jwt malformed
 *        invalid token signature:
 *         value:
 *          message: invalid signature
 *    '403':
 *     description: <b>Forbidden</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Not authorized to delete this comment.
 *    '404':
 *     description: <b>Not Found</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       examples:
 *        location not found:
 *         value:
 *          message: No course with id '735a62f5dc5d7968e6846914' found.
 *        comment not found:
 *         value:
 *          message: No review with id '736346e7171e084ff4e4bbf9' found.
 *        no comments found:
 *         value:
 *          message: No reviews found.
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/ErrorMessage'
 *       example:
 *        message: Database not available.
 */

module.exports = {
    reviewDetails,
    reviewCreate,
    reviewDelete
};