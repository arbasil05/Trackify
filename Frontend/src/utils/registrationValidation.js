import axios from "axios";
import toast from 'react-hot-toast';

const registrationValidation = async (nav, name, regno, gradYear, dept, password, cpassword) => {
    if (name.trim() === "" || regno.trim() === "" || gradYear.trim() === "" || dept.trim() === "" || password.trim() === "" || cpassword.trim() === "") {
        toast.error("Please fill out all the fields");
        return { status: false };
    }

    if (regno.length < 12) {
        toast.error("Please use a valid register number");
        return { status: false };
    }

    if (password.length < 8) {
        toast.error("Please use a password of at least 8 characters");
        return { status: false };
    }

    if (password !== cpassword) {
        toast.error("Passwords do not match");
        return { status: false };
    }

    try {
        const url = `http://localhost:5001/api/register`;
        const res = await axios.post(
            url,
            {
                name: name,
                reg_no: regno,
                grad_year: gradYear,
                dept: dept,
                password: password
            },
            { withCredentials: true }
        );

        console.log(res.data.user);
        toast.success("Account Creation Success");
        nav("/home");
        return { status: true };
    } catch (error) {
        if (error.response?.status === 409) {
            toast.error("User already exists");
        } else {
            console.log(`Error while posting: ${error}`);
            toast.error("Error while posting");
        }
        return { status: false };
    }
};

export default registrationValidation;
