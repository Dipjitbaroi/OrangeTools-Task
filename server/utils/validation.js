export const isValidEmail = (email) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/; // Example: 10-digit US phone number
    return phoneRegex.test(phone);
};
