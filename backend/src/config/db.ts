

// connect to a MONGODB STRING

import { Mongoose, Schema } from "mongoose";
import mongoose from "mongoose"
import { boolean } from "zod";


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

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    // added the description which will be displayed on the BLOGCARD
    description: {
        type:String,
        required:true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    publishedDate: {
        type: Date,
        default: Date.now,
    },
    // The new tags field is added here as an array of strings
    tags: {
        type: [String],
        default: [],
    },
})

export const blogmodel = mongoose.model("blogs",blogSchema);
export const usermodel =  mongoose.model("users",userschema);
