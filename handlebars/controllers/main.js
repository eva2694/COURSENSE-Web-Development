//logika-funkcija za prikaz home page
const path = require("path");
const  home = (req, res) => {
    res.render("home");

}


const  profile = (req, res) => {
    res.render("profile");

}

const  courses = (req, res) => {
    res.render("courses");

}

const  search = (req, res) => {
    res.render("search");

}
module.exports = {
    home,
    profile,
    courses,
    search,
}