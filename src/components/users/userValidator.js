const { body } = require("express-validator");

module.exports.userCreationRules = () => {
  return [
    body("fullName")
      .trim()
      .isLength({ min: 3, max: 25 })
      .withMessage("The User Name must be between 3 to 25 characters."),
    body("email")
      .isEmail()
      .withMessage("The Email must be valid!")
      .notEmpty()
      .withMessage("The Email cannot be empty!"),
    body("mobileNo")
      .isNumeric()
      .withMessage("The mobile number should be numeric!"),
    body("role").isString().withMessage("The role must be a string."),
    body("isActive")
      .isBoolean()
      .withMessage("The account status must be boolean."),
  ];
};
