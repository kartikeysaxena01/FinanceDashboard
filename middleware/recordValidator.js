const { body } = require('express-validator');

exports.createRecordValidator = [

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be number"),

  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["income","expense"])
    .withMessage("Type must be income or expense"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .trim()
    .isLength({max:50})
    .withMessage("Category must be less than 50 characters"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("note")
    .notEmpty()
    .withMessage("Note is required")
    .trim()
    .isLength({max:300})
    .withMessage("Note cannot exceed 300 characters")

];