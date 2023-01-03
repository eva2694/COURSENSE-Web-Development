//router
const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require("express-jwt");
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: "payload",
    algorithms: ["HS256"],
});
//controllers
const ctrlReviews = require('../controllers/reviews');
const ctrlCourses = require('../controllers/courses');
const ctrlProfile = require('../controllers/profile');
const ctrlAuthentication = require("../controllers/authentication");
const ctrlMaintnace = require("../controllers/maintnace");
const ctrlContact = require("../controllers/contact");
    /*reviews*/
router.get('/courses/:courseId/reviews/:reviewId', ctrlReviews.reviewDetails); //DONE
router.post('/courses/:courseId/reviews',  auth, ctrlReviews.reviewCreate); //DONE
router.delete('/courses/:courseId/reviews/:reviewId',  auth, ctrlReviews.reviewDelete);//DONE
    /*courses */
router.get('/courses', ctrlCourses.courseListFilter);
router.get('/courses/:courseId', ctrlCourses.courseDetails);
    /*profile */
router.get('/profile/:profileId', ctrlProfile.profileDetails);
router.put('/profile/:profileId',  auth, ctrlProfile.profileEdit);
router.delete('/profile/:profileId', auth,ctrlProfile.profileDelete);
router.get('/profile/getId/:name', ctrlProfile.profileId);
    /*authentication*/
router.post("/register", ctrlAuthentication.register);
router.post("/login", ctrlAuthentication.login);
    /*maintenance*/
router.delete("/db", auth, ctrlMaintnace.deleteAll);
router.post("/db", auth, ctrlMaintnace.importAll);
    /*spellchecking*/
router.post("/spellcheck", auth, ctrlCourses.spellcheck);
    /*contact*/
router.post("/contact", ctrlContact.sendMail);

module.exports = router;