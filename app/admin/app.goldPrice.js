const winston = require("winston");
const _ = require("lodash");
const { GoldPrice, validateGoldPrice } = require("../../models/admin/model.goldPrice");

module.exports.createPrice = async function (req) {
    try {

        try {
            // Validation
            const { error } = validateGoldPrice(req.body);
            if (error) {
                winston.error(`${error}`);
                throw { status: false, data: error, errorCode: 400 };
            }

            // Now updating gold price
            winston.info(`Updating gold price: ${req.body.price}`);

            let price = new GoldPrice(req.body);

            await price.save();

            winston.info(`Gold Price Update successfully`);

            return { status: true, data: _.pick(price, ["_id", "price", "createdAt"]), errorCode: null };

        } catch (error) {
            console.log(error);
            winston.debug(`Transaction failed`);

            if (error.code === 11000) return { status: false, data: 'Conflict: Duplicate Key: ' + JSON.stringify(error.keyValue), errorCode: 409 };
            if (error.status && error.errorCode) return error;
            return { status: false, data: error, errorCode: 500 };
        }
    } catch (error) {
        console.log(error);
        return { status: false, data: error, errorCode: 500 };
    }
}

module.exports.getAllGoldPrice = async function (req) {
    try {
        winston.info(`Getting All Gold Prices`);

        let price = await GoldPrice.find({ isDeleted: false });
        if (_.isEmpty(price)) {
            winston.error(`Invalid _id`);
            return { status: false, data: error, errorCode: 404 };
        }

        return { status: true, data: price, errorCode: null };

    } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            winston.error(`Invalid  ID: ${id}`);
            return { status: false, data: 'Invalid  ID', errorCode: 404 }
        }
        return { status: false, data: null, errorCode: 500 };
    }
}

