const AppError = require("../../utils/appError");
const termsCondDAL = require("./termsAndConditionDAL");
const colors = require("../../utils/colors");
const { buildResJson } = require("../../utils/respJson");

module.exports.updateMethod = async function (req, res, next) {
  var data = {
    content: req.body.content,
    updatedAt: new Date(),
  };
  try {
    let termsCondData = await termsCondDAL.update(data);
    res
      .status(200)
      .json(buildResJson("The content data has been updated.", termsCondData));
  } catch (err) {
    return next(
      new AppError("An error occured while updating the record.", 400, err)
    );
  }
};

module.exports.getByIdMethod = async function (req, res, next) {
  var data = { _id: req.params.id };
  try {
    let termsCondData = await termsCondDAL.getSingle(data);
    res
      .status(200)
      .json(buildResJson("The content data has been updated.", termsCondData));
  } catch (err) {
    return next(
      new AppError("An error occured while updating the record.", 400, err)
    );
  }
};
