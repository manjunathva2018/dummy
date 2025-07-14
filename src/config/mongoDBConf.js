const mongoose = require("mongoose");
const { appConfig } = require("./appConfig");

module.exports.mongoStart = function () {
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(appConfig.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      });
      console.log(
        colors.green,
        `MongoDB connected to ${appConfig.NODE_ENV} database`
      );
      resolve(true);
    } catch (err) {
      console.error(
        colors.red,
        `Error connecting to ${appConfig.NODE_ENV} Database`,
        err
      );
      reject(new Error(err));
    }
  });
};
