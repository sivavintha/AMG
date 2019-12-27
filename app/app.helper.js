const bcrypt = require("bcryptjs");
const winston = require("winston");
const nodemailer = require("nodemailer");
const nconf = require("nconf");
const { EmailTemplate } = require("../models/foundation/model.emailTemplate")

module.exports.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

module.exports.sendEmail = async function(receiver, type, options, attachments) {
    try {
        winston.info(`Sending an email to ${receiver}`);
        const template = await EmailTemplate.findOne({type: type});
        if(!template) {
            winston.error(`Template of type : ${type} not found`);
            return ({ status: false, code: 404, data: 'template not found'});
        }
        if(!attachments) attachments = [];
        let transporter = nodemailer.createTransport({
            host: nconf.get('emailHost'),
            port: nconf.get('emailPort'),
            auth: {
              user: nconf.get('emailID'),
              pass: nconf.get('emailPassword')
            },
            tls: {
                rejectUnauthorized: false
            }
        });

          let mailOptions = {
            from: nconf.get('emailID'),
            to: receiver,
            subject: template.subject,
            html: template.body.interpolate(options),
            attachments: attachments
          };

          const email = await transporter.sendMail(mailOptions);
          winston.info(`Sent email`);
          if(email.accepted.length === 0) {
            winston.error('Email not accepted');
            return({status: false, data: 'Email not accepted'});
          }
          return ({status: true, data: 'Email sent'})
    } catch (error) {
        console.log(error);
        return({status: false, data: 'Email not accepted'});
    }
}

