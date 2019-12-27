const winston = require("winston");
const _ = require("lodash");
const nconf = require('nconf');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { AdminUsers, validateAdminUsers } = require("../../models/admin/model.adminUsers");
const { hashPassword, sendEmail } = require("../app.helper");

module.exports.loginUser = async function(body) {
  try {
      const user = await AdminUsers.findOne({userName: body.userName});

      // Checking if user exists
      if(!user) {
        winston.error(`User not found`);
        return { status: false, data: new Error('User not found'), errorCode: 404 };
      }

      // Checking if user is removed
      if(!user.isDeleted) {
        winston.error(`The user ${user.userName} is not exists in payroll`);
        return { status: false, data: new Error('Already Removed'), errorCode: 401 };
      }

      // Checking if user is activated
      if(!user.isActive) {
        winston.error(`The user ${user.userName} is not activated`);
        return { status: false, data: new Error('Not activated yet'), errorCode: 401 };
      }

      // Checking password
      let isValid = await bcrypt.compare(body.password, user.password)
      if(!isValid) {
        winston.error(`Password does not match`);
        return { status: false, data: new Error('Invalid password'), errorCode: 403 };
      }

      // Generating token
      const token = user.generateToken();
      winston.debug(`Token: ${token}`);     
         
      return { status: true, data: token, errorCode: null };
  } catch (error) {
      console.log(error);
      return { status: false, data: error, errorCode: 500 };
  }
}

module.exports.createUser = async function (req) {
  try {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
      winston.debug(`Transaction started`);

      req.body.password = await hashPassword(req.body.password)

      // Validation
      const { error } = validateAdminUsers(req.body);
      if (error) {
        winston.error(`${error}`);
        throw { status: false, data: error, errorCode: 400 };
      }

      // Now registering the user
      winston.info(`Registering Admin User: ${req.body.name}`);
      req.body.createdAt = Date.now()

      let user = new AdminUsers(req.body);
      const token = user.generateToken();

      // await user.save({ session });
      await user.save();

      winston.info(`Registered Admin User successfully`);
      // await session.commitTransaction();
      // session.endSession();
      return { status: true, data: _.assign(_.pick(user, ["_id", "name", "emailId", "mobileNumber", "mobileNumberCountryCode", "userName"]), { "token": token }), errorCode: null };

    } catch (error) {
      console.log(error);
      winston.debug(`Transaction failed`);
      // await session.abortTransaction();
      // session.endSession();
      if (error.code === 11000) return { status: false, data: 'Conflict: Duplicate Key: ' + JSON.stringify(error.keyValue), errorCode: 409 };
      if (error.status && error.errorCode) return error;
      return { status: false, data: error, errorCode: 500 };
    }
  } catch (error) {
    console.log(error);
    return { status: false, data: error, errorCode: 500 };
  }
}

module.exports.updateUser = async function (req) {
  try {
    winston.info(`Updating information of user: ${req.body.name}`);

    let { error } = await validateAdminUsers(JSON.stringify(req.body));
    if (error) {
      console.log(error);
      return { status: false, data: error, errorCode: 400 };
    }

    let user = await AdminUsers.findById(req.body._id);
    if (_.isEmpty(user)) {
      winston.error(`Invalid _id`);
      return { status: false, data: error, errorCode: 404 };
    }

    user.name = req.body.name;
    user.emailId = req.body.emailId;
    user.mobileNumber = req.body.mobileNumber;
    user.mobileNumberCountryCode = req.body.mobileNumberCountryCode;
    user.phoneNumber = req.body.phoneNumber;
    user.phoneNumberCountryCode = req.body.phoneNumberCountryCode;
    user.isActive = req.body.isActive;
    user.userRole = req.body.userRole;
    user.currentUser = req.body.currentUser;

    await new AdminUsers(user).save();
    return { status: true, data: _.pick(user, ["_id", "name", "emailId", "mobileNumber", "mobileNumberCountryCode", "userName"]), errorCode: null };

  } catch (error) {
    console.log(error);
    return { status: false, data: error, errorCode: 500 };
  }
}


module.exports.getUserByID = async function (id) {
  try {
    winston.info(`Getting information of user: ${id}`);

    let user = await AdminUsers.findById(id);
    if (_.isEmpty(user)) {
      winston.error(`Invalid _id`);
      return { status: false, data: error, errorCode: 404 };
    }

    return { status: true, data: user, errorCode: null };

  } catch (error) {
    console.log(error);
    if (error.name === 'CastError') {
      winston.error(`Invalid  ID: ${id}`);
      return { status: false, data: 'Invalid  ID', errorCode: 404 }
    }
    return { status: false, data: null, errorCode: 500 };
  }
}

module.exports.getAllUser = async function (req) {
  try {
    winston.info(`Getting All Users`);

    let user = await AdminUsers.find({ isDeleted: false });
    if (_.isEmpty(user)) {
      winston.error(`Invalid _id`);
      return { status: false, data: error, errorCode: 404 };
    }

    return { status: true, data: user, errorCode: null };

  } catch (error) {
    console.log(error);
    if (error.name === 'CastError') {
      winston.error(`Invalid  ID: ${id}`);
      return { status: false, data: 'Invalid  ID', errorCode: 404 }
    }
    return { status: false, data: null, errorCode: 500 };
  }
}

module.exports.deleteUser = async function (id, req) {
  try {
    winston.info(`Deleting information of user: ${req.body.name}`);

    let user = await AdminUsers.findOneAndUpdate({ _id: id }, { isDeleted: true, deletedBy: req.body.currentUser, deletedAt: Date.now() }, { new: true });
    if (_.isEmpty(user)) {
      winston.error(`Invalid _id`);
      return { status: false, data: error, errorCode: 404 };
    }

    return { status: true, data: user, errorCode: null };

  } catch (error) {
    console.log(error);
    return { status: false, data: error, errorCode: 500 };
  }
}

