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

    try {
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

    // check for an exisitng user
    const existinguser = await usermodel.findOne({email:email});
    if(existinguser)
    {
        return res.status(409).json({
            "message":"user already exists, enter new/unique credentials"
        }
        )
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newuser = await usermodel.create({
      name,
      email,
      password:hashedPassword,
    });

    console.log('User saved to DB:', newuser);
    const token = jwt.sign({ id: newuser._id },
       process.env.JWT_SECRET as string, 
       { expiresIn: '1h' });

               
       return res.status(200).json({
        message: "User registered successfully.",
        token: token
    });

    }
    catch(error)
    {
        console.log("Error signing in ",error);
        return res.status(500).json({
            "message":"Internal server error"
        })
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
        const user = await usermodel.findOne({ email: email })

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
                process.env.JWT_SECRET as string, 
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