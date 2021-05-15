const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const formValidation = require("../../validations/form.validation");
const formController = require("../../controllers/form.controller");

const router = express.Router();

router
  .route("/")
  .post(auth(), validate(formValidation.createForm), formController.createForm)
  .get(auth(), formController.getForms);

router
  .route("/:formId")
  .get(auth(), validate(formValidation.getForm), formController.getForm)
  .patch(auth(), validate(formValidation.updateForm), formController.updateForm)
  .delete(
    auth(),
    validate(formValidation.deleteForm),
    formController.deleteForm
  );

router
  .route("/public/:formId")
  .get(validate(formValidation.getForm), formController.getForm);

module.exports = router;
