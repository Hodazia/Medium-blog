

// connect to a MONGODB STRING

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

