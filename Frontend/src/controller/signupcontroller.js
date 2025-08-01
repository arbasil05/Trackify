export const validateStep = (formData, step) => {
    const errors = {};
    const isEmpty = (value) => value.trim() === "";

    if (step === 1) {
        if (isEmpty(formData.name)) {
            errors.name = "Name is required";
            errors.value = "Name is required";
        } else if (isEmpty(formData.regno)) {
            errors.regno = "Register number is required";
            errors.value = "Register number is required";
        } else if (formData.regno.length !== 12) {
            errors.regno = "Register number must be 12 characters";
            errors.value = "Register number must be 12 characters";
        }
    }

    if (step === 2) {
        if (isEmpty(formData.gradYear)) {
            errors.gradYear = "Select graduation year";
            errors.value = "Select graduation year";
        } else if (isEmpty(formData.department)) {
            errors.department = "Select department";
            errors.value = "Select department";
        }
    }

    if (step === 3) {
        if (isEmpty(formData.password)) {
            errors.password = "Password is required";
            errors.value = "Password is required";
        } else if (isEmpty(formData.confirmPassword)) {
            errors.confirmPassword = "Confirm password is required";
            errors.value = "Confirm password is required";
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
            errors.value = "Passwords do not match";
        }
    }

    // Apply red border to invalid fields
    const allFields = ["name", "regno", "gradYear", "department", "password", "confirmPassword"];

    allFields.forEach((key) => {
        const wrapper = document.querySelector(`[name="${key}"]`)?.closest('.input-with-icon');
        if (wrapper) {
            if (errors[key]) {
                wrapper.style.border = "2px solid red";
                wrapper.style.borderRadius = "8px";
                wrapper.style.padding = "5px";
            } else {
                wrapper.style.border = "none";
                wrapper.style.padding = "0";
            }
        }
    });

    return errors;
};
