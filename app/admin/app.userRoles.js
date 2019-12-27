const winston = require("winston");
const _ = require("lodash");
const { UserRoles, validateUserRoles } = require("../../models/admin/model.userRoles");

module.exports.createRoles = async function (req) {
    try {

        try {
            // Validation
            const { error } = validateUserRoles(req.body);
            if (error) {
                winston.error(`${error}`);
                throw { status: false, data: error, errorCode: 400 };
            }

            // Now creating the userrole
            winston.info(`Creating Role: ${req.body.roleName}`);

            let userRoles = new UserRoles(req.body);

            await userRoles.save();

            winston.info(`Created Roles successfully`);

            return { status: true, data: _.pick(userRoles, ["_id", "roleName", "menuId"]), errorCode: null };

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

module.exports.updateRoles = async function (req) {
    try {
        winston.info(`Updating information of user: ${req.body.roleName}`);

        let { error } = await validateUserRoles(JSON.stringify(req.body));
        if (error) {
            console.log(error);
            return { status: false, data: error, errorCode: 400 };
        }

        let roles = await UserRoles.findById(req.body._id);
        if (_.isEmpty(roles)) {
            winston.error(`Invalid _id`);
            return { status: false, data: error, errorCode: 404 };
        }

        roles.menuId = req.body.menuId;

        await new UserRoles(roles).save();
        return { status: true, data: _.pick(roles, ["_id", "roleName", "menuId"]), errorCode: null };

    } catch (error) {
        console.log(error);
        return { status: false, data: error, errorCode: 500 };
    }
}


module.exports.getRolesByID = async function (id) {
    try {
        winston.info(`Getting information of user: ${id}`);

        let roles = await UserRoles.findById(id);
        if (_.isEmpty(roles)) {
            winston.error(`Invalid _id`);
            return { status: false, data: error, errorCode: 404 };
        }

        return { status: true, data: roles, errorCode: null };

    } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            winston.error(`Invalid  ID: ${id}`);
            return { status: false, data: 'Invalid  ID', errorCode: 404 }
        }
        return { status: false, data: null, errorCode: 500 };
    }
}

module.exports.getAllRoles = async function (req) {
    try {
        winston.info(`Getting All Roles`);

        let roles = await UserRoles.find({ isDeleted: false });
        if (_.isEmpty(roles)) {
            winston.error(`Invalid _id`);
            return { status: false, data: error, errorCode: 404 };
        }

        return { status: true, data: roles, errorCode: null };

    } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            winston.error(`Invalid  ID: ${id}`);
            return { status: false, data: 'Invalid  ID', errorCode: 404 }
        }
        return { status: false, data: null, errorCode: 500 };
    }
}

module.exports.deleteRoles = async function (id, req) {
    try {
        winston.info(`Deleting information of user: ${req.body.roleName}`);

        let roles = await UserRoles.findOneAndUpdate({ _id: id }, { isDeleted: true, deletedBy: req.body.currentUser, deletedAt: Date.now() }, { new: true });
        if (_.isEmpty(roles)) {
            winston.error(`Invalid _id`);
            return { status: false, data: error, errorCode: 404 };
        }

        return { status: true, data: roles, errorCode: null };

    } catch (error) {
        console.log(error);
        return { status: false, data: error, errorCode: 500 };
    }
}

