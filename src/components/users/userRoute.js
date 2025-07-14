const express = require("express");
const router = express.Router();
const multer = require("multer");
const randomstring = require("randomstring");
const mime = require("mime");
const path = require("path");
const { appConfig } = require("../../config/appConfig");
const userController = require("./userController");
const { validateRequest } = require("../../middlewares/validationHandler");
const { userCreationRules } = require("./userValidator");
const authJWT = require("../../middlewares/authJWT");

router
  .route("/")
  .post(
    authJWT.verifyJWTToken,
    userCreationRules(),
    validateRequest,
    userController.createUserMethod
  )
  .get(authJWT.verifyJWTToken, userController.getAllMethod);

router
  .route("/:userId")
  .get(authJWT.verifyJWTToken, userController.getUserByIdMethod)
  .put(authJWT.verifyJWTToken, userController.updateMethod)
  .delete(authJWT.verifyJWTToken, userController.deleteUserMethod);

module.exports = router;
