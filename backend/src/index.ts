//console.log("hello world");

/*
don't use nodemailer for API production, use it for testing puropose,dev
for prod , no nodemailer,
*/
import express from "express";
import { Request, Response } from "express";
import { db } from "./config/db";

const app =express();
app.use(express.json());

app.get("/",(req:Request,res:Response) => {
    res.json({
        "message":"your api is runnig bruv! LOL <$>"
    })
})

// connecting to the DB and schema/model defining
db();
app.listen(3000, () => {
    console.log("greetings we are listening to u, at port 3000");
})

