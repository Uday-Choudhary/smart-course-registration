const validator = require('validator');

const validateEmail = (email) => {
    return email && validator.isEmail(email);
};

const validatePassword = (password) => {
    if (!password) return false;

    const minLength = 8;
    // const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return password.length >= minLength &&
        // hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar;
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
