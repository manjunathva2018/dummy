// import mongoose models
const userModel = require("./userModel");

async function createUser(data) {
  const details = new userModel(data);
  try {
    let result = await details.save();
    return result;
  } catch (err) {
    throw err;
  }
}

async function getAllUsers(data) {
  try {
    let result = await userModel.find({}).sort({ _id: -1 }).lean();
    return result;
  } catch (err) {
    throw err;
  }
}

async function getUserById(data) {
  try {
    let result = await userModel.findById({ _id: data._id }).lean();
    return result;
  } catch (err) {
    throw err;
  }
}

async function updateUser(data) {
  try {
    let result = await userModel.findOneAndUpdate({ _id: data._id }, data, {
      new: true,
    });
    return result;
  } catch (err) {
    throw err;
  }
}

async function deleteUser(data) {
  try {
    let result = await userModel.deleteOne({ _id: data._id });
    return result;
  } catch (err) {
    throw err;
  }
}

// export 4 functions i.e create,read,update,delete
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
