const nodemailer = require('nodemailer');

const sendMail = function(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;

    const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false, //  SSL
        auth: {
            user: 'eu2694@student.uni-lj.si',
            pass: process.env.MAIL
        }
    });


    const mailOptions = {
        from: 'eu2694@student.uni-lj.si', //spremeni mail in dodaj svoje geslo v .env (MAIL=<mojeGeslo>)
        to: 'eu2694@student.uni-lj.si',
        subject: `New message from ${name}`,
        text: `From: ${name} (${email})\n\n${message}`,
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: 'Failed to send email' });
        } else {
            console.log('Message sent: %s', info.messageId);
            res.send({ message: 'Email sent successfully' });
        }
    });
};

/**
 * @openapi
 * paths:
 *  /contact:
 *   post:
 *    summary: Send email
 *    operationId: sendMail
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        required:
 *         - name
 *         - email
 *         - message
 *        properties:
 *         name:
 *          type: string
 *          example: John Doe
 *         email:
 *          type: string
 *          example: john.doe@example.com
 *         message:
 *          type: string
 *          example: Hello, I'm interested in your service. Can you please provide more information?
 *    responses:
 *     200:
 *      description: Email sent successfully
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           example: Email sent successfully
 *     500:
 *      description: Failed to send email
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          message:
 *           type: string
 *           example: Failed to send email
 *    tags:
 *     - Contact
 */


module.exports = {
    sendMail
};