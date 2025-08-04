"use strict";
// define user routers with their controllers, as well
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const validation_1 = require("../config/validation");
const db_1 = require("../config/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//@ts-ignore
const JWT_SECRET = process.env.JWT_SECRET;
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // signup router, we need a zod validation for this
    try {
        const { email, password, name } = req.body;
        const { success } = validation_1.signupInput.safeParse({
            email,
            password,
            name
        });
        //let user = await usermodel.findOne({email:email});
        if (!success) {
            return res.status(400).json({
                "message": "Enter the correct credentials "
            });
        }
        // check for an exisitng user
        const existinguser = yield db_1.usermodel.findOne({ email: email });
        if (existinguser) {
            return res.status(409).json({
                "message": "user already exists, enter new/unique credentials"
            });
        }
        //hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newuser = yield db_1.usermodel.create({
            name,
            email,
            password: hashedPassword,
        });
        console.log('User saved to DB:', newuser);
        const token = jsonwebtoken_1.default.sign({ id: newuser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            message: "User registered successfully.",
            token: token
        });
    }
    catch (error) {
        console.log("Error signing in ", error);
        return res.status(500).json({
            "message": "Internal server error"
        });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // now u are signed up, now create 
    const { email, password } = req.body;
    // first check for validation schema
    const { success } = validation_1.signinInput.safeParse({
        email,
        password,
    });
    if (!success) {
        return res.status(404).json({
            "message": "enter valid credentials"
        });
    }
    // check for the user in the DB
    try {
        // Check for the user in the DB
        // Ensure your usermodel query can find the password field if it's 'select: false'
        const user = yield db_1.usermodel.findOne({ email: email });
        if (!user) {
            // Use 401 Unauthorized for invalid credentials (generic message for security)
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }
        const isPasswordMatched = yield bcryptjs_1.default.compare(password, user.password);
        if (isPasswordMatched) {
            const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            // 200 OK for successful login
            return res.status(200).json({
                message: "Logged in successfully.",
                token: token
            });
        }
        else {
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }
    }
    catch (e) {
        console.error("Signin error:", e);
        return res.status(500).json({
            message: "An internal server error occurred during login. Please try again."
        });
    }
}));
exports.default = router;
