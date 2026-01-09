import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateOTP, storeOTP, sendOTP } from "../services/otpService.js";



const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;

export async function register(req, res) {
    try {
        if (!req.body) {
            throw new Error("No data recieved");
        }

        const { name, grad_year, dept, password } = req.body;
        const email = req.verifiedEmail;

        if (!name || !email || !grad_year || !dept || !password) {
            throw new Error("Missing fields!");
        }

        const user = await User.create({
            name,
            email,
            grad_year,
            dept,
            password,
        });

        // create the token for the session
        const token = jwt.sign({ id: user._id }, SECRET_JWT_KEY);

        // console.log(`JWT Token generated successfully : ${token}`);

        // create cookie
        // res.cookie("jwt", token, {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: "lax",
        //     maxAge: 24 * 60 * 60 * 1000,
        // });
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        })

        // console.log("Cookie set successfully!");
        res.status(201).json({ user: user, message: "Success" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "User already exist" });
        }
        // console.log(`Error in /signup ${error}`);
        res.status(500).json({ message: "Error", error: error });
    }
}

export async function login(req, res) {
    try {
        if (!req.body) {
            throw new Error("No data recieved");
        }

        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error("Missing Fields");
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        const validUser = await user.compare(password);
        // console.log(validUser);
        if (!validUser) {
            throw new Error("Password is incorrect");
        }

        const token = jwt.sign({ id: user._id }, SECRET_JWT_KEY);

        // console.log(`JWT token : ${token}`);

        // res.cookie("jwt", token, {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: "lax",
        //     maxAge: 24 * 60 * 60 * 1000,
        // });
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        })

        // console.log(`Cookie created Succesfully`);

        res.status(200).json({ user: user, message: "Success" });
    } catch (error) {
        // console.log(`Error in /login ${error}`);
        res.status(401).json({ message: "Error while logging in" });
    }
}

export async function logout(req, res) {
    try {
        // res.clearCookie("jwt", {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: "lax",
        //     maxAge: 24 * 60 * 60 * 1000,
        // });
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(200).json({ message: "Log out successfull" });
    } catch (error) {
        // console.log(`Error in logout ${error}`);
    }
}

export async function sendOtp(req, res) {
    try {
        const { email, purpose } = req.body;

        if (!email || !purpose) {
            return res.status(400).json({ error: 'Email and purpose required' });
        }

        const existingUser = await User.findOne({ email });

        if (purpose === 'registration' && existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        else if (purpose === 'password_reset' && !existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const code = generateOTP();
        await storeOTP(email, code, purpose);

        await sendOTP(email, code, purpose);

        return res.json({ message: 'OTP sent to email' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while sending OTP" });
    }

}

export async function forgotPassword(req, res) {
    try {
        const { password, confirmPassword } = req.body;
        const email = req.verifiedEmail;

        if (!password || !confirmPassword) {
            return res.status(400).json({ error: 'Password and confirm password required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.password = password;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });

    } catch (error) {
        // console.log(error);
        res.status(500).json({ message: "Error while resetting password" });
    }
}
