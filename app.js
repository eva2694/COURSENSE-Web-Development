//Load environment variables
require("dotenv").config();

//Swagger, OpenAPI
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = swaggerJsDoc({
    definition: {
        openapi: "3.0.3",
        info: {
            title: "CoursenseAPI",
            version: "0.1.0",
            description:
                "**REST API** for the course platform Coursense\n\nThe application supports:\n* **filtering nearby** cultural herritage **locations**,\n* **adding comments** to existing locations,\n* and more.",
        },
        tags: [
            {
                name: "Courses",
                description: "The <b>courses</b> on the platform COURSENSE.",
            },
            {
                name: "Reviews",
                description: "The <b>reviews</b> of the courses.",
            },
            {
                name: "Profile",
                description: "The <b>profile</b> of the users.",
            },
            {
                name: "Authentication",
                description: "<b>User management</b> and authentication.",
            },
            {
                name: "Administration",
                description: "<b>administration calls</b>."
            },
            {
                name: "Contact",
                description: "The <b>contact form</b> on the platform COURSENSE.",
            },
            {
                name: "Maintenance",
                description: "The <b>maintenance</b> on the platform COURSENSE.",
            },

        ],
        servers: [
            {
                url: "http://localhost:3000/api",
                description: "Development server for testing",
            },
            {
                url: "https://coursense.onrender.com/api",
                description: "Production server",
            },
        ],
        components: {
            securitySchemes: {
                jwt: {
                    type: "http",
                    scheme: "bearer",
                    in: "header",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                ErrorMessage: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Message describing the error.",
                        },
                    },
                    required: ["message"],
                },
            },
        },
    },
    apis: ["./api/models/*.js", "./api/controllers/*.js"],
});


//knjižnice
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require("passport");
//Database connection
require("./api/models/db.js");
//router
const indexRouter = require('./api/routes/index');
//port
const port = process.env.PORT || 3000;
//express
const app = express();
//MIDDLEWARE:
    //cors
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//static files
app.use(express.static(path.join(__dirname, "angular", "build")));
    //passport
require ("./api/config/passport");
app.use(passport.initialize());
    //api routing
app.use("/api", indexRouter);
    //angular routing
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "angular", "build", "index.html"));
});

//Swagger file and explorer
indexRouter.get("/swagger.json", (req, res) =>
    res.status(200).json(swaggerDocument)
);
indexRouter.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        customCss: ".swagger-ui .topbar { display: none }",
    })
);

//Authorization error handler
app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError")
        res.status(401).json({ message: err.message });
});

//zagon strežnika
app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});

module.exports = app;