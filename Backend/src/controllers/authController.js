import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
    createUser,
    findUserByEmail,
} from "../models/userModel.js";

// REGISTER
export const register = async (
    req,
    res
) => {
    try {
        const {
            username,
            email,
            password,
        } = req.body;

        // validasi kosong
        if (
            !username ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                message:
                    "All fields are required",
            });
        }

        // cek email sudah ada
        const existingUser =
            await findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                message:
                    "Email already exists",
            });
        }

        // hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // create user
        const user = await createUser(
            username,
            email,
            hashedPassword
        );

        res.status(201).json({
            message:
                "Register success",
            user,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Internal server error",
        });
    }
};

// LOGIN
export const login = async (
    req,
    res
) => {
    try {
        const {
            email,
            password,
        } = req.body;

        const user =
            await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                message:
                    "User not found",
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );

        if (!isMatch) {
            return res.status(401).json({
                message:
                    "Wrong password",
            });
        }

        const token = jwt.sign(
            {
                id: user.id_users,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "Login success",
            token,
            user,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message:
                "Internal server error",
        });
    }
};