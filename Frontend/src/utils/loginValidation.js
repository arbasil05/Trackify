import axios from "axios"
import toast from "react-hot-toast";

const loginValidation = (nav, regno, password) => {
    if (regno.length < 12) {
        toast.error("Please enter a valid register number");
        return { status: false }
    }
    if (password.length < 8) {
        toast.error("Password too short");
        return { status: false }
    }

    const url = "http://localhost:5001/api/login";
    axios.post(url, { reg_no: regno, password: password }, { withCredentials: true })
        .then((res) => {
            console.log(res.data.user);
            toast.success("Login Success");
        })
        .then(() => {
            nav("/home")
        })
        .catch((error) => {
            console.log(`Error while logging in ${error}`);
            if (error.response && error.response.status === 401) {
                toast.error("User does not exist");
            }
            else {
                toast.error("Error while logging in");
            }
        })

    return { status: true, message: "Login Success" };
}

export default loginValidation;