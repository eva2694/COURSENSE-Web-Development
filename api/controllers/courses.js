const mongoose = require("mongoose");
const {Course} = require('../models/schemas');
const axios = require("axios");

//sorting, filtering, pagination
const courseListFilter = async (req, res) => {

    try {
        const page = parseInt(req.query.page)-1||0;
        const limit = parseInt(req.query.limit)||5; //NA VSAKI STRANI BO PRIKAZANIH 5 COURSOV
        const search = req.query.search||"";
        let sort = req.query.sort||"avg_rating";
        //let sortP = req.query.sortP||"price";
        let category = req.query.category||"All";
        const categories = [
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
        ];
        category = category === "All" ? [...categories]: req.query.category.split(",");
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
        if (sort[1]) {
            sortBy[sort[0]] = sort[1];
        } else {
            sortBy[sort[0]] = "asc";
        }

        const courses = await Course.find({
            $or: [
                {title: { $regex: search, $options: "i" }},
                {keywords: { $regex: search, $options: "i" }}
            ]
        })
            .where("category")
            .in([...category])
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit);

        const total = await Course.countDocuments({
            category: { $in: [...category] },
            $or: [
                {title: { $regex: search, $options: "i" }}, // i ... case-insensitive
                {keywords: { $regex: search, $options: "i" }}
            ]
        });

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            categories: categories,
            courses,
        };

        res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};
/**
 * @openapi
 * /courses/{courseId}:
 *   get:
 *    summary: Get details of a course by ID.
 *    description: Show the specific course page using ID.
 *    tags: [Courses]
 *    parameters:
 *    - name: courseId
 *      in: path
 *      required: true
 *      description: <b>unique identifier</b> of course
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      example: 635a62f5dc5d7968e68464c1
 *    responses:
 *     '200':
 *      description: <b>OK</b>, with course details.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/courses'
 *        example:
 *         _id: 635a62f5dc5d7968e68464c1
 *         title: Tumblr for dummies
 *         description: With this course we will be learning about the pitfalls of using tik tok, exploiting them and overcoming our initial problems.
 *         authors: Zado Bizantinski
 *         price: 240
 *         language: german
 *         category: Business
 *         keywords: [tumblr, beginner]
 *         image: palecnoht.png
 *         accessURL: https://www.oreilly.com/library/view/tumblr-for-dummies/9781118370827/03_9781118370827-intro.html
 *         avg_rating: 4
 *         reviews: []
 *         createdOn: 2020-12-25T17:43:00:000Z
 *     '404':
 *      description: <b>Not Found</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "Course with id '735a62f5dc5d7968e68464c1' not found."
 *     '500':
 *      description: <b>Internal Server Error</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "Cast to ObjectId failed for value \"1\" (type string) at path \"_id\" for model \"Courses\""
 */

//details
const courseDetails = (req, res) => {
    Course.findById(req.params.courseId)
        .select("-id")
        .exec((err, course) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else if (!course) {
                res.status(404).json({
                    message:
                        "No Course with id: '" + req.params.courseId + "' found.",
                });
            } else {
                res.status(200).json(course);
            }
        });
};
/**
 * @openapi
 * paths:
 *  /courses:
 *   get:
 *    summary: Get list of filtered courses
 *    operationId: courseListFilter
 *    parameters:
 *     - in: query
 *       name: page
 *       schema:
 *        type: integer
 *       description: Page number
 *     - in: query
 *       name: limit
 *       schema:
 *        type: integer
 *       description: Number of courses per page
 *     - in: query
 *       name: sort
 *       schema:
 *        type: string
 *       description: Sort field (price, name, etc.)
 *     - in: query
 *       name: search
 *       schema:
 *        type: string
 *       description: Search query
 *     - in: query
 *       name: category
 *       schema:
 *        type: string
 *       description: Course category
 *    responses:
 *     200:
 *      description: List of filtered courses
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          error:
 *           type: boolean
 *           example: false
 *          total:
 *           type: integer
 *           example: 10
 *          page:
 *           type: integer
 *           example: 1
 *          limit:
 *           type: integer
 *           example: 5
 *          categories:
 *           type: array
 *           items:
 *            type: string
 *           example: ["Development", "Business", "Finance & Accounting", "IT & Software", "Office Productivity", "Personal Development", "Design", "Marketing", "Lifestyle", "Photography & Video", "Health & Fitness", "Music", "Teaching & Academics", "Other"]
 *          courses:
 *           type: array
 *           items:
 *            $ref: '#/components/schemas/Course'
 *    tags:
 *     - Courses
 */

//external api
const spellcheck = (req, res) => {
    const options = {
        method: 'POST',
        url: 'https://jspell-checker.p.rapidapi.com/check',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'f6595498f7msh4bcdcae356d8b01p1d420cjsn551071b2fb99',
            'X-RapidAPI-Host': 'jspell-checker.p.rapidapi.com'
        },
        data: `{"language":"enUS","fieldvalues":"${req.body.text}","config":{"forceUpperCase":false,"ignoreIrregularCaps":false,"ignoreFirstCaps":true,"ignoreNumbers":true,"ignoreUpper":false,"ignoreDouble":false,"ignoreWordsWithNumbers":true}}`
    };

    axios.request(options).then(function (response) {
        res.status(200).json(response.data.spellingErrorCount.toString());
    }).catch(function (error) {
        console.error(error);
    });
};
/**
 * @openapi
 * paths:
 *  /spellcheck:
 *   post:
 *    summary: Check spelling of a given text
 *    operationId: spellcheck
 *    parameters:
 *     - in: body
 *       name: text
 *       schema:
 *        type: string
 *       description: Text to check spelling of
 *    responses:
 *     200:
 *      description: Spelling error count
 *      content:
 *       application/json:
 *        schema:
 *         type: string
 *         example: "2"
 *    tags:
 *     - Courses
 */

module.exports = {
    courseListFilter,
    courseDetails,
    spellcheck
};