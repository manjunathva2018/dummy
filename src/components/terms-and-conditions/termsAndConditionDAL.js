// import mongoose models
const termsCond = require("./termsAndConditionModel");

async function update(data) {
  try {
    let result = await termsCond.findOneAndUpdate(
      { _id: 1 },
      {
        content: data.content,
        updatedAt: data.updatedAt,
      },
      { upsert: true, new: true }
    );
    return result;
  } catch (err) {
    throw err;
  }
}

async function getSingle(data) {
  try {
    let result = await termsCond.findById({ _id: data._id });
    return result;
  } catch (err) {
    throw err;
  }
}

// export 2 functions i.e read,update
module.exports = {
  update,
  getSingle,
};
