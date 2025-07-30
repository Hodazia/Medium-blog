// define user routers with their controllers, as well


import express from 'express'
import { Request,Response } from 'express';
const router = express.Router();
import { signinInput,signupInput } from '../config/validation';
import z from 'zod';

router.post("/signup", async (req : Request,res: Response) => {
    // signup router, we need a zod validation for this
    const {email,password,name} = req.body;

    const {success} = signupInput.safeParse({
        email,
        password,
        name
    })

    if(!success)
    {
        return res.json({
            status:404,
            "message":"Enter the correct credentials "
        })
    }

    else{
        // put the credentials in the DB, with bcrypt and jwt in it 
    }

})