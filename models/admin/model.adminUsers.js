const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const nconf = require("nconf");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    emailId: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true, unique: true },
    mobileNumberCountryCode: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    phoneNumberCountryCode: { type: String, required: false },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    userRole: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    createdBy: { type: String, required: false },
    // createdAt: { type: Date, required: false },
    updatedBy: { type: String, required: false },
    // updatedAt: { type: Date, required: false },
    isDeleted: { type: Boolean, required: false },
    deletedBy: { type: String, required: false },
    deletedAt: { type: Date, required: false },
    currentUser: { type: String, required: false }
}, { timestamps: true });

userSchema.methods.generateToken = function () {
    const token = jwt.sign({
        _id: this._id,
        email: this.email,
        mobileNumber: this.mobileNumber,
        mobileNumberCountryCode: this.mobileNumberCountryCode
    }, nconf.get("privateKey"), { expiresIn: '9999999h' });
    return token;
};

userSchema.pre('save', async function (next) {
    try {
        let now = Date.now();

        this.isDeleted = false;
        this.deletedBy = "";
        this.deletedAt = "";

        if (!this.createdBy)
            this.createdBy = this.currentUser;

        if (!this.createdAt)
            this.createdAt = now;

        this.updatedBy = this.currentUser;
        this.updatedAt = now;


        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});


function validateAdminUsers(user) {
    const joiSchema = Joi.object().keys({
        _id: Joi.string(),
        name: Joi.string().min(3).max(50).required(),
        emailId: Joi.string().email().required(),
        userName: Joi.string().required(),           
        password: Joi.string().min(2).max(300).when('userName', {
            is: '',
            then: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
            otherwise: Joi.allow(null)
        }),
        mobileNumber: Joi.string().min(5).max(15).required(),
        mobileNumberCountryCode: Joi.string().min(1).max(15).required(),
        phoneNumber: Joi.string().allow('').min(5).max(15),
        phoneNumberCountryCode: Joi.string().allow('').min(1).max(15),
        userRole: Joi.string().required(),
        isActive: Joi.boolean().required(),
        createdBy: Joi.string().allow(''),
        createdAt: Joi.date().allow(''),
        updatedBy: Joi.string().allow(''),
        updatedAt: Joi.date().allow(''),
        isDeleted: Joi.boolean().allow(''),
        deletedBy: Joi.string().allow(''),
        deletedAt: Joi.date().allow(''),
        currentUser: Joi.string().required()
    });
    return JSON.parse(JSON.stringify(Joi.validate(user, joiSchema)));
}

const AdminUsers = mongoose.model("adminUsers", userSchema);

exports.AdminUsers = AdminUsers;
exports.validateAdminUsers = validateAdminUsers;