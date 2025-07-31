

// connect to a MONGODB STRING

import { Schema } from "mongoose";
import mongoose from "mongoose"


export const db = async () => {
    try{
        await mongoose.connect(`${process.env.MONGO_DB_URL}`);
        console.log("database is connected successfully!");
    }
    catch(err){
        console.log(err)
    }
}

const userschema = new Schema({
    name: {type:String, required:true},
    email: {type:String, required:true},
    password: {type:String,required:true}
})

export const usermodel =  mongoose.model("users",userschema);
