const Joi = require("joi");
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    roleName: { type: String, required: true, unique: true },
    menuId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'menus', required: false }],
    createdBy: { type: String, required: false },
    updatedBy: { type: String, required: false },
    isDeleted: { type: Boolean, required: false },
    deletedBy: { type: String, required: false },
    deletedAt: { type: Date, required: false },
    currentUser: { type: String, required: false }
}, { timestamps: true });


roleSchema.pre('save', async function (next) {
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


function validateUserRoles(roles) {
    const joiSchema = Joi.object().keys({
        _id: Joi.string(),
        roleName: Joi.string().min(3).max(50).required(),
        menuId: Joi.array().items(Joi.string().optional()),
        createdBy: Joi.string().allow(''),
        createdAt: Joi.date().allow(''),
        updatedBy: Joi.string().allow(''),
        updatedAt: Joi.date().allow(''),
        isDeleted: Joi.boolean().allow(''),
        deletedBy: Joi.string().allow(''),
        deletedAt: Joi.date().allow(''),
        currentUser: Joi.string().required()
    });
    return JSON.parse(JSON.stringify(Joi.validate(roles, joiSchema)));
}

const UserRoles = mongoose.model("userroles", roleSchema);

exports.UserRoles = UserRoles;
exports.validateUserRoles = validateUserRoles;