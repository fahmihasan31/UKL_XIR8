const { validationResult, checkSchema } = require('express-validator');


// Validation schema
const adminValidationSchema = {
  name: {
    notEmpty: true,
    errorMessage: 'Name is required',
  },
  email: {
    notEmpty: true,
    errorMessage: 'Email is required',
  },
  password: {
    notEmpty: true,
    isLength: {
      options: { min: 8 }, // Change the minimum password length to 3
      errorMessage: 'Password should be at least 8 chars',
    },
  },
};

// Validation check
const validateAdmin = [
  checkSchema(adminValidationSchema),

  // Custom validation logic
  (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      let errMessage = errors.array().map((it) => it.msg).join(',');

      return response.status(422).json({
        success: false,
        message: errMessage,
      });
    }
    next();
  },
];

module.exports = { validateAdmin };