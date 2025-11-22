const validator = require('validator');

const validateEmail = (email) => {
    return email && validator.isEmail(email);
};

const validatePassword = (password) => {
    return password && validator.isLength(password, { min: 6 });
};

const validateId = (id) => {
    return id && validator.isInt(String(id));
};

const validateRequiredFields = (fields) => {
    for (const [key, value] of Object.entries(fields)) {
        if (!value || (typeof value === 'string' && validator.isEmpty(value.trim()))) {
            return `Field '${key}' is required`;
        }
    }
    return null;
};

module.exports = {
    validateEmail,
    validatePassword,
    validateId,
    validateRequiredFields,
    validator // Export raw validator for specific cases
};
