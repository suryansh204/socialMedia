export const validateRegisterInput = (
    username, email, password, confirmPassword
) => {
    const errors = {};

    // username can't be empty
    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }

    // email can't be empty
    if (email.trim() === '') {
        errors.email = 'Email must not be empty';
    } else {
        // valid email
        const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email.match(regEx)) {
            errors.email = 'Email must be a valid email address'
        }
    }

    // password can't be empty
    if (password === '') {
        errors.password = 'Password must not be empty';
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }

    // return errors and valid boolean
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

export const validateLoginInput = (username, password) => {
    const errors = {};

    if (username.trim() === '') {
        errors.username = 'Username must not be empty';
    }
    if (password.trim() === '') {
        errors.password = 'Password must not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }


}