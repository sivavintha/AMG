const express = require("express");
const router = express.Router();
const auth = require("../../middleware/middleware.auth");
const admin = require("../../middleware/middleware.admin");
const winston = require("winston");
const _ = require('lodash');

const { createRoles, updateRoles, getRolesByID, getAllRoles, deleteRoles } = require("../../app/admin/app.userRoles")

// CREATE ROLES
router.post("/create", [auth], async (req, res) => {
    try {
        winston.info(`Creating Role for Super-Admin Users: ${req.body.roleName}`);
        const result = await createRoles(_.pick(req, ['user', 'body']));
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


// UPDATE ROLES
router.put("/update", [auth], async (req, res) => {
    try {
        winston.info(`Updating Role details of Super - Admin: ${req.body.roleName}`);
        const result = await updateRoles(_.pick(req, ['user', 'body']));
        if (result.status) {
            return res.status(200).send({ payload: result.data });
        } else {
            return res.status(result.errorCode).send({ payload: result.data });
        }
    } catch (error) {
        winston.error(`${error}`);
        return res.status(500).send({ payload: error });
    }
});

//GETTING ALL ROLES
router.get("/query", [auth], async (req, res) => {
    try {
        winston.info(`Getting roles by query`);
        const result = await getAllRoles(req.body);
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

//GETTING ROLES BY ID
router.post("/:id", [auth], async (req, res) => {
    try {
        winston.info(`Getting roles by ID`);
        const result = await getRolesByID(req.params.id);        
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

// DELETING ROLES
router.delete("/:id", [auth], async (req, res) => {
    try {
        winston.info(`Deleting Roles details of Super - Admin: ${req.body.roleName}`);
        const result = await deleteRoles(req.params.id, req);
        if (result.status) {
            return res.status(200).send({ payload: result.data });
        } else {
            return res.status(result.errorCode).send({ payload: result.data });
        }
    } catch (error) {
        winston.error(`${error}`);
        return res.status(500).send({ payload: error });
    }
});

module.exports = router;