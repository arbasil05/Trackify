import User from "../models/User.js";
import jwt from "jsonwebtoken";


const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;

export async function register(req, res) {
    try {
        if (!req.body) {
            throw new Error("No data recieved");
        }

        const { name, email, reg_no, grad_year, dept, password } = req.body;

        if (!name || !email || !reg_no || !grad_year || !dept || !password) {
            throw new Error("Missing fields!");
        }

        const user = await User.create({
            name,
            email,
            reg_no,
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
        console.log(`Error in /signup ${error}`);
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
        console.log(`Error in /login ${error}`);
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
        console.log(`Error in logout ${error}`);
    }
}