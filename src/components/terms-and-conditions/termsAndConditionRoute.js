const express = require("express");
const router = express.Router();
const { termsCondUpdationRules } = require("./termsAndConditionValidator");
const { validateRequest } = require("../../middlewares/validationHandler");
const termsCondCtrler = require("./termsAndConditionController");
const authJWT = require("./../../middlewares/authJWT");

router
  .route("/")
  .put(
    authJWT.verifyJWTToken,
    termsCondUpdationRules(),
    validateRequest,
    termsCondCtrler.updateMethod
  );

router.route("/:id").get(authJWT.verifyJWTToken, termsCondCtrler.getByIdMethod);

module.exports = router;
