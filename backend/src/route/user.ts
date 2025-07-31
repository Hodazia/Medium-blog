// define user routers with their controllers, as well


import express from 'express'
import { Request,Response } from 'express';
const router = express.Router();
import { signinInput,signupInput } from '../config/validation';
import z from 'zod';
import { usermodel } from '../config/db';
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

//@ts-ignore
const JWT_SECRET : string = process.env.JWT_SECRET;

router.post("/signup", async (req : Request,res: Response) => {
    // signup router, we need a zod validation for this
    const {email,password,name} = req.body;

    const {success} = signupInput.safeParse({
        email,
        password,
        name
    })

    //let user = await usermodel.findOne({email:email});


    if(!success)
    {
        return res.status(400).json({
            "message":"Enter the correct credentials "
        })
    }
    try {
        // Check if user already exists
        const existingUser = await usermodel.findOne({ email: email });

        if (existingUser) {
            
            return res.status(409).json({
                message: "A user with this email already exists."
            });
        }

        // --- Hash Password ---

        const hashedPassword = await bcrypt.hash(password, 10); 

        // Create new user in the database
        const newUser = await usermodel.create({
            name: name,
            email: email,
            password: hashedPassword
        });


        const token = jwt.sign(
            { id: newUser._id }, // Payload
            JWT_SECRET,          // Secret
            { expiresIn: '1h' }  // Options
        );

        
        return res.status(200).json({
            message: "User registered successfully.",
            token: token
        });

    } catch (dbError) {
        // Catch any database or unexpected errors
        console.error("Error during signup:", dbError);
        return res.status(500).json({
            message: "An internal server error occurred during registration. Please try again."
        });
    }

})

router.post("/signin", async (req:Request,res:Response) => {
    // now u are signed up, now create 
    const {email,password} = req.body;
    // first check for validation schema
    const {success} = signinInput.safeParse({
        email,
        password,
    })
    if(!success)
    {
        return res.status(404).json({
            "message":"enter valid credentials"
        })
    }

    // check for the user in the DB
    
    try {
        // Check for the user in the DB
        // Ensure your usermodel query can find the password field if it's 'select: false'
        const user = await usermodel.findOne({ email: email }).select('+password'); // Add .select('+password') if it's excluded by default

        if (!user) {
            // Use 401 Unauthorized for invalid credentials (generic message for security)
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }


        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (isPasswordMatched) {
            
            const token = jwt.sign(
                { id: user._id }, 
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            // 200 OK for successful login
            return res.status(200).json({
                message: "Logged in successfully.",
                token: token
            });
        } else {
            
            return res.status(400).json({
                message: "Invalid email or password."
            });
        }

    } catch (e) {
        
        console.error("Signin error:", e);
        return res.status(500).json({
            message: "An internal server error occurred during login. Please try again."
        });
    }
})

export default router