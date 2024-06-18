const mongoose = require("mongoose");
require("dotenv").config();

const JobPostSchema = require("../Schemas/JobPost");

const transferJobPosts = async (local, remote) => {
  const conn_local = mongoose.createConnection(local);
  const conn_remote = mongoose.createConnection(remote);

  const JobPost_local = conn_local.model("JobPost", JobPostSchema);
  const JobPost_remote = conn_remote.model("JobPost", JobPostSchema);

  const total = await JobPost_local.countDocuments();
  let count = 0;

  for await (let job of JobPost_local.find().lean()) {
    console.log(`processing: ${job._id}`);

    try {
      const res = await JobPost_remote.create(job);
      if (res) count++;
    } catch (error) {
      console.error(`error: ${job._id} : ${error.message}`);
    }
  }

  console.log(
    `Total: ${total}, inserted: ${count}, not inserted: ${total - count}`
  );

  conn_local.close();
  conn_remote.close();

  return { total, count };
};

module.exports = { transferJobPosts };
