const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const AppError = require("../../utils/appError");
const { buildResJson } = require("../../utils/respJson");
const { appConfig } = require("../../config/appConfig");
const colors = require("../../utils/colors");
const userDAL = require("./userDAL");
const authDAL = require("../auth/authDAL");
const email = require("../../utils/email");
const emailLogDAL = require("../email-logs/emaillogDAL");
const saltRounds = 10;

module.exports.createUserMethod = async function (req, res, next) {
  const data = req.body;
  try {
    let emailExists = await authDAL.authUser(data);
    if (emailExists != null)
      return next(new AppError("User email already exsits!", 403));

    if (!data.password) {
      data.password = data.mobileNo.toString();
    }
    // password encryption
    let hash = bcrypt.hashSync(data.password, saltRounds);
    data.password = hash;

    try {
      let userData = await userDAL.createUser(data);
      let template = userData;
      template.logo = path.join(appConfig.FRONT_END_LOGO_URL);
      template.password = data.mobileNo.toString();
      template.url = path.join(appConfig.FRONT_END_URL);
      template.subject = "Welcome to our CRM application!";

      try {
        template.html = await ejs.renderFile(
          path.join(__dirname, "../../utils/email-templates/user-creation.ejs"),
          template
        );
        // Email sending
        let log = {
          sentFromModule: "User Module",
          sentByUserName: req.decoded == undefined ? "ADMIN" : req.decoded.slug,
          status: "",
          errorMessage: "",
        };
        try {
          await email.sendMail(template.email, template.subject, template.html);
          log.status = "SENT";
          await emailLogDAL.create(log);
        } catch (e) {
          log.status = "NOT_SENT";
          log.errorMessage = e;
          await emailLogDAL.create(log);
        }
      } catch (err) {
        console.log("user-creation.ejs template render error", err);
      }

      return res
        .status(201)
        .json(buildResJson("User created successfully.", userData));
    } catch (err) {
      console.log(colors.red, `createUserMethod err ${err}`);
      // send status code 400 i.e error with json object
      return next(
        new AppError(
          "An error occured while creating the user, please try again.",
          400,
          err
        )
      );
    }
  } catch (error) {
    console.log(colors.red, `bcrypt err:`);
    return next(
      new AppError(
        "An unknown error occured while saving the data, please try again.",
        400,
        error
      )
    );
  }
};

module.exports.getAllMethod = async function (req, res, next) {
  const data = {};
  try {
    let userData = await userDAL.getAllUsers(data);

    return res
      .status(200)
      .json(buildResJson("All User records fetched.", userData));
  } catch (err) {
    return next(
      new AppError("An error occured while fetching user records.", 400, err)
    );
  }
};

module.exports.getUserByIdMethod = async function (req, res, next) {
  try {
    const data = { _id: mongoose.Types.ObjectId(req.params.userId) };
    let userData = await userDAL.getUserById(data);
    if (!userData) return next(new AppError("user does not exists!", 404));
    return res
      .status(200)
      .json(buildResJson("fetched User details.", userData));
  } catch (err) {
    return next(
      new AppError(
        "Error occured while fetching the requested record.",
        400,
        err
      )
    );
  }
};

module.exports.updateMethod = async function (req, res, next) {
  const data = req.body;
  try {
    const userExsits = await userDAL.getUserById({ _id: req.params.userId });
    if (!userExsits) return next(new AppError("user does not exists!", 404));

    data._id = mongoose.Types.ObjectId(req.params.userId);
    data.updatedAt = new Date();
    let userData = await userDAL.updateUser(data);
    return res
      .status(200)
      .json(buildResJson("Updated the data successfully.", userData));
  } catch (error) {
    return next(
      new AppError("An error occured while updating the data.", 400, error)
    );
  }
};

module.exports.deleteUserMethod = async function (req, res, next) {
  try {
    const data = { _id: mongoose.Types.ObjectId(req.params.userId) };
    const userExsits = await userDAL.getUserById(data);
    if (!userExsits) return next(new AppError("user does not exists!", 404));
    const userData = await userDAL.deleteUser(data);
    return res
      .status(200)
      .json(buildResJson("The user has been deleted successfully.", userData));
  } catch (err) {
    return next(
      new AppError("An errror occured while deleting the user.", 400, err)
    );
  }
};

