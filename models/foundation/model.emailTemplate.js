const Joi = require("joi");
const mongoose = require("mongoose");

const emailTemplateSchema = {
    type: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
}

function validateEmailTemplate(emailTemplate) {
    const schema = Joi.object().keys({
        type: Joi.string().min(1).max(40).required(),
        subject: Joi.string().min(1).max(40).required(),
        body: Joi.string().min(1).required(),
    });
    return Joi.validate(emailTemplate, schema);
}

const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);

exports.validateEmailTemplate = validateEmailTemplate;
exports.EmailTemplate = EmailTemplate;