const fs = require('fs')

const logResultsToFile = async (filename, results) => {
  await fs.promises.writeFile(filename, JSON.stringify(results), { flag: "w" });
};

module.exports = logResultsToFile;