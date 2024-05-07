

// email validation
export const isEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

// full name validation
export const allLetter = (text) => {
    if (text.trim().length < 5 || text.trim().length > 25) {
        return false;
    }
    return true;
}
// password validation
export const checkPassword = (password) => {
    if (/^[A-Za-z]\w{7,14}$/.test(password.trim())) {
        return true;
    }
    return false;
};
