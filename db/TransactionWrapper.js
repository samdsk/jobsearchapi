const mongoose = require("mongoose");

const transactionWrapper = async (filter, fn) => {
  const session = await mongoose.startSession();
  const response = null;

  try {
    session.startTransaction();
    response = await fn(filter, session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
    return response;
  }
};

module.exports = { transactionWrapper };
