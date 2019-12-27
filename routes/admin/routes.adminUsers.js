const express = require("express");
const router = express.Router();
const auth = require("../../middleware/middleware.auth");
const admin = require("../../middleware/middleware.admin");
const winston = require("winston");
const _ = require('lodash');

const { createUser, updateUser, getUserByID, getAllUser, deleteUser, loginUser } = require("../../app/admin/app.adminUsers")

// LOGIN
router.post("/login", async (req, res) => {
    try {
      winston.info(`Logging in user: ${req.body.userName}`);
  
      const result = await loginUser(req.body);
      if(result.status) {
        winston.info('Logged in User');
        return res.header("x-auth-token", result.data).status(200).send({payload: {}});
      } else {
          return res.status(result.errorCode).send({ payload: result.data });
      }
    } catch (error) {
      winston.error(`${error}`);
      return res.status(500).send({ payload: error });
    }
  });

// CREATE USERs
router.post("/create", [auth, admin], async (req, res) => {
    try {
        winston.info(`Creating Users of Super-Admin : ${req.body.name}`);
        const result = await createUser(_.pick(req, ['user', 'body']));
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


// UPDATE USER
router.put("/update", [auth, admin], async (req, res) => {
    try {
        winston.info(`Updating User details of Super - Admin: ${req.body.name}`);
        const result = await updateUser(_.pick(req, ['user', 'body']));
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

//Getting All Users
router.get("/query", [auth], async (req, res) => {
    try {
        winston.info(`Getting user by query`);
        const result = await getAllUser(req.body);
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

//Getting User By ID
router.post("/:id", [auth], async (req, res) => {
    try {
        winston.info(`Getting user by ID`);
        const result = await getUserByID(req.params.id);        
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

// Deleting USER
router.delete("/:id", [auth, admin], async (req, res) => {
    try {
        winston.info(`Deleting User details of Super - Admin: ${req.body.name}`);
        const result = await deleteUser(req.params.id, req);
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