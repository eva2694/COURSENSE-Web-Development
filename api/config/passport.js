const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const {User} = require('../models/schemas.js');


passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        (username, password, cbDone) => {
            User.findOne({ email: username }, (err, user) => {
                if (err) return cbDone(err);
                if (!user)
                    return cbDone(null, false, { message: "Incorrect username/email." });
                if (!user.validPassword(password))
                    return cbDone(null, false, { message: "Incorrect password." });
                else return cbDone(null, user);
            });
        }
    )
);