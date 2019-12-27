const express = require("express");
const router = express.Router();
const auth = require("../../middleware/middleware.auth");
const admin = require("../../middleware/middleware.admin");
const winston = require("winston");
const _ = require('lodash');

const { createPrice, getAllGoldPrice } = require("../../app/admin/app.goldPrice")

// CREATE GOLD PRICE
router.post("/create", [auth], async (req, res) => {
    try {
        winston.info(`Creating gold price: ${req.body.price}`);
        const result = await createPrice(_.pick(req, ['user', 'body']));
        if (result.status) {
            return res.status(200).send({ payload: result.data });
        }
        else {
            return res.status(result.errorCode).send({ payload: result.data });
        }
    } catch (error) {
        winston.error(`${error}`);
        return res.status(500).send({ payload: error });
    }
});


//GETTING ALL GOLD PRICE
router.get("/query", [auth], async (req, res) => {
    try {
        winston.info(`Getting gold prices by query`);
        const result = await getAllGoldPrice(req.body);
        if (result.status) {
            return res.status(200).send({ payload: result.data });
        } else {
            return res.status(result.errorCode).send({ payload: result.data });
        }
    } catch (error) {
        winston.error(`${error}`);
        return res.status(500).send({ payload: error });
    }
})

module.exports = router;