const {body}=require('express-validator');

exports.updateRecordValditor=[
    body("amount")
        .optional()
        .isNumeric()
        .withMessage("Amount must be number"),
    body("type")
        .optional()
        .isIn(["income","expense"])
        .withMessage("Type must be income or expense"),
    body("category")
        .optional()
        .trim()
        .isLength({max:30})
        .withMessage("Category must be less than 50 characters"),
    body("date")
        .optional()
        .isISO8601()
        .withMessage("Invalid date format"),
    body("note")
        .optional()
        .trim()
        .isLength({max:300})
        .withMessage("Note cannot exceed 300 characters")
];