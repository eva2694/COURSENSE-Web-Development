
const mongoose = require("mongoose");
const {User, Course} = require("../models/schemas");

const profileDetails = (req, res) => {
    User.findById(req.params.profileId)
        .select("-id")
        .exec((err, user) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else if (!user) {
                res.status(404).json({
                    message:
                        "No User with id: '" + req.params.profileId + "' found.",
                });
            } else {
                res.status(200).json(user);
            }
        });
};

/**
 * @openapi
 * /profile/{profileId}:
 *   get:
 *    summary: Get details of a user profile by ID.
 *    description: Show the specific profile page using ID.
 *    tags: [Profile]
 *    parameters:
 *    - name: profileId
 *      in: path
 *      required: true
 *      description: <b>unique identifier</b> of user
 *      schema:
 *       type: string
 *       pattern: '^[a-fA-F\d]{24}$'
 *      example: 635a62f5dc5d7968e68464c1
 *    responses:
 *     '200':
 *      description: <b>OK</b>, with profile details.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/user'
 *        example:
 *         _id: 635a62f5dc5d7968e68464c1
 *         email: lz223@gmail.com
 *         name: Lado Bizovicar
 *         profile:
 *         firstName: Lado
 *         lastName: Bizovicar
 *         bio: Learning stuff.
 *         occupation: comedian
 *         type: User
 *     '404':
 *      description: <b>Not Found</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "Profile with id '735a62f5dc5d7968e68464c1' not found."
 *     '500':
 *      description: <b>Internal Server Error</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: "Cast to ObjectId failed for value \"1\" (type string) at path \"_id\" for model \"User\""
 */

const profileId = async (req, res) => {
   const name = req.params.name;
    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        return res.send({ id: user._id });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

/**
 * @openapi
 * paths:
 *   /profile/getId/{name}:
 *     get:
 *       summary: Get a user's ID by their name
 *       parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *       tags: [Profile]
 *       responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the user
 *         404:
 *           description: |
 *             <b>Not Found</b>, with error message.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message
 *         500:
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Error message
 */
const profileEdit =  (req, res) => {

    if (!req.params.profileId) {
        res.status(400).json({
            message: "Path parameter 'profileId' is required.",
        });
    } else {
        User.findById(req.params.profileId)
            .exec((err, user) => {
                if (err) res.status(500).json({ message: err.message });
                else if (!user) {
                    res.status(404).json({
                        message:
                            "User with id '" + req.params.userId + "' not found.",
                    });
                } else {
                    getAuthor(req, res, (req, res, author) => {

                        if (!req.body.firstName && !req.body.lastName && !req.body.bio && !req.body.occupation) {
                            res.status(400).json({
                                message:
                                    "At least on of profile parameters  is required.",
                            });
                        } else if (author.email != user.email) {
                            res.status(403).json({
                                message: "Not authorized to edit this user profile.",
                            });
                        } else {
                            if(req.body && req.body.firstName) user.profile.firstName = req.body.firstName;
                            if(req.body && req.body.lastName) user.profile.lastName = req.body.lastName;
                            if(req.body && req.body.bio) user.profile.bio = req.body.bio;
                            if(req.body && req.body.occupation) user.profile.occupation = req.body.occupation;

                            user.save((err, user) => {
                                if (err) res.status(500).json({ message: err.message });
                                else {
                                    res.status(200).json(user);
                                }
                            });
                        }
                    });
                }


            });
    }

};
/**
 * @openapi
 * paths:
 *  /profile/{profileId}:
 *   put:
 *    summary: Edit profile
 *    operationId: profileEdit
 *    parameters:
 *     - in: path
 *       name: profileId
 *       required: true
 *       schema:
 *        type: string
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         firstName:
 *          type: string
 *          example: John
 *         lastName:
 *          type: string
 *          example: Doe
 *         bio:
 *          type: string
 *          example: I'm an experienced software developer.
 *         occupation:
 *          type: string
 *          example: Software Developer
 *    responses:
 *     200:
 *      description: Profile updated successfully
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/User'
 *     400:
 *      description: At least on of profile parameters is required
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           example: At least on of profile parameters is required.
 *     403:
 *      description: Not authorized to edit this user profile
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           example: Not authorized to edit this user profile.
 *     404:
 *      description: User not found
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           example: User with id '{profileId}' not found.
 *     500:
 *      description: Error occurred while updating profile
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           example: An error occurred while updating the profile.
 *    security:
 *     - bearerAuth: []
 *    tags:
 *     - Profile
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
const profileDelete = (req, res) => {
    const user = User.findById(req.params.profileId);
    if (!user) {
        res.status(404).json({
            message:
                "No User with id: '" + req.params.profileId + "' found.",
        });
    } else {
        getAuthor(req, res, (req, res, owner) => {
            if (req.params.profileId != owner._id) {
                res.status(403).json({
                    message: "Not authorized to delete this user profile.",
                });
            } else {
                user.remove();
                res.status(204).send();
            }
        });
    }
};
/**
 * @openapi
 * /profile/{profileId}:
 *   delete:
 *     summary: Delete a user profile
 *     description: Delete a user profile
 *     operationId: profileDelete
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *         description: The id of the user profile to delete
 *     tags: [Profile]
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       204:
 *         description: Successfully deleted user profile
 *       403:
 *         description: Not authorized to delete this user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User with the specified profileId not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */



module.exports = {
    profileDetails,
    profileId,
    profileEdit,
    profileDelete
};