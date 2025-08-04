//console.log("hello world");

/*
don't use nodemon for production, use it for testing puropose,dev
for prod , no nodemon,
*/
import express from "express";
import { Request, Response } from "express";
import { db } from "./config/db";
import dotenv from 'dotenv'
import userrouter from "./route/user"
import blogrouter from "./route/blog"
import cors from "cors";
dotenv.config(); // let' the .env files be fetched

const app =express();
app.use(express.json());

app.use(cors());

app.get("/",(req:Request,res:Response) => {
    res.json({
        "message":"your api is runnig bruv! LOL <$>"
    })
})

// connecting to the DB and schema/model defining
db();
app.use("/api/v1/user",userrouter);
app.use("/api/v1/blog",blogrouter);
app.listen(3000, () => {
    console.log("greetings we are listening to u, at port 3000");
})

