const Annotation = require("../Models/Annotation");
const AnnotationService = require("../Services/AnnotationService");
const {
  searchMultiple,
  searchSingle,
  createSimpleDocument,
} = require("./CommonControllerMethods");
const RequestError = require("../Errors/RequestError");

const searchAnnotation = async (req, res, next) => {
  try {
    const result = await searchMultiple(req, Annotation.Annotation);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const getAnnotation = async (req, res, next) => {
  try {
    const result = await searchSingle(req, Annotation.Annotation);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const createAnnotation = async (req, res, next) => {
  // const role = req.body.role || "";
  // const id = req.body.id || "";
  // const background = req.body.background || "";
  // const isHuman = req.body.isHuman || undefined;
  // try {
  //   if (!id)
  //     throw new RequestError("Create operation failed, id is required", 400);
  //   const result = await createSimpleDocument(
  //     { _id: id, role: role, background: background, isHuman: isHuman },
  //     AnnotationService.create
  //   );
  //   return res.json(result);
  // } catch (error) {
  //   next(error);
  // }
};

const updateAnnotation = async (req, res, next) => {
  // const role = req.body.role || "";
  // const background = req.body.background || "";
  // const isHuman = req.body.isHuman || "";
  // const id = req.body.id || "";
  // try {
  //   if (!id) throw new RequestError("id is required", 400);
  //   const update = {};
  //   console.log(role, background, isHuman);
  //   if (role) update.role = role;
  //   if (background) update.background = background;
  //   if (isHuman) update.isHuman = isHuman;
  //   const result = await AnnotationService.updateAnnotation(id, update);
  //   if (result === null) throw new RequestError(`Update operation failed`, 400);
  //   return res.json({ success: true });
  // } catch (error) {
  //   next(error);
  // }
};

const deleteAnnotation = async (req, res, next) => {
  // const id = req.body.id || "";
  // try {
  //   if (!id) throw new RequestError("id is required", 400);
  //   const result = await AnnotationService.deleteAnnotation(id);
  //   if (result === null) throw new RequestError(`Delete operation failed`, 400);
  //   return res.json({ success: true, result: result });
  // } catch (error) {
  //   next(error);
  // }
};

module.exports = {
  searchAnnotation,
  getAnnotation,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
};
