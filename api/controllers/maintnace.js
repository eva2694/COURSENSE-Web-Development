const mongoose = require("mongoose");
const {Course, User} = require('../models/schemas');
const {exec} = require("child_process");

const getAuthor = (req, res, cbResult) => {
    if (req.auth && req.auth.email) {
        User.findOne({ email: req.auth.email }).exec((err, user) => {
            if (err) res.status(500).json({ message: err.message });
            else if (!user) res.status(401).json({ message: "User not found." });
            else cbResult(req, res, user);
        });
    }
};

const importAll = (req, res) => {
    getAuthor(req, res, (req, res, author) => {
        if(author.userType != "Admin") {
            res.status(403).json({
                message: "Not authorized to import documents.",
            });
        } else {
            let exec = require('child_process').exec;
            let command = 'mongoimport --db CourSense --collection Courses --mode upsert --upsertFields id --jsonArray --file data/courses.json';
            exec(command, (err, stdout, stderr) => {
                if (err) res.status(500).json({ message: err.message });
                else res.status(200).json({message: "import successful"});
            });
        }

    });
};

/**
 * @openapi
 * paths:
 *  /db:
 *   post:
 *    summary: Import all documents
 *    tags: [Maintenance]
 *    operationId: importAll
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         userType:
 *          type: string
 *          enum:
 *           - Admin
 *    responses:
 *     200:
 *      description: Import successful
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           example: import successful
 *     403:
 *      description: Not authorized to import documents
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           example: Not authorized to import documents.
 *     500:
 *      description: Error occurred while importing documents
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           example: An error occurred while importing documents
 *    security:
 *     - bearerAuth: []
 */


const deleteAll = (req, res) => {
    getAuthor(req, res, (req, res, author) => {
        if(author.userType != "Admin") {
            res.status(403).json({
                message: "Not authorized to delete documents.",
            });
        } else {
            Course.remove({}, function (err) {
                    if (err) {
                        console.log(err);
                        res.status(500).json({message: err.message});
                    } else {
                        res.status(204).send();
                    }
                }
            );
        }

    });
};
/**
 * @openapi
 * paths:
 *  /db:
 *   delete:
 *    summary: Delete all documents
 *    tags: [Maintenance]
 *    operationId: deleteAll
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         userType:
 *          type: string
 *          enum:
 *           - Admin
 *    responses:
 *     204:
 *      description: Delete successful
 *     403:
 *      description: Not authorized to delete documents
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           example: Not authorized to delete documents.
 *     500:
 *      description: Error occurred while deleting documents
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           example: An error occurred while deleting documents
 *    security:
 *     - bearerAuth: []
 */

module.exports = {
    importAll,
    deleteAll
};