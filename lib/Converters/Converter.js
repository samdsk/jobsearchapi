module.exports = class Converter {
  constructor() {
    throw new Error("Converter class is an abstract class!");
  }
  static convert(job, job_type) {
    throw new Error(" convert() must be implemented!");
  }
};
