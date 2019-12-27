const Joi = require("joi");
const mongoose = require("mongoose");

const goldPriceSchema = new mongoose.Schema({
    price: { type: Number, required: true },
    currency: { type: String, required: false },
    createdBy: { type: String, required: false },
    updatedBy: { type: String, required: false },
    isDeleted: { type: Boolean, required: false },
    deletedBy: { type: String, required: false },
    deletedAt: { type: Date, required: false },
    currentUser: { type: String, required: false }
}, { timestamps: true });


goldPriceSchema.pre('save', async function (next) {
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


function validateGoldPrice(goldPrice) {
    const joiSchema = Joi.object().keys({
        _id: Joi.string(),
        price: Joi.number().required(),
        currency: Joi.string().optional().default('USD'),
        createdBy: Joi.string().allow(''),
        createdAt: Joi.date().allow(''),
        updatedBy: Joi.string().allow(''),
        updatedAt: Joi.date().allow(''),
        isDeleted: Joi.boolean().allow(''),
        deletedBy: Joi.string().allow(''),
        deletedAt: Joi.date().allow(''),
        currentUser: Joi.string().required()
    });
    return JSON.parse(JSON.stringify(Joi.validate(goldPrice, joiSchema)));
}

const GoldPrice = mongoose.model("goldprice", goldPriceSchema);

exports.GoldPrice = GoldPrice;
exports.validateGoldPrice = validateGoldPrice;