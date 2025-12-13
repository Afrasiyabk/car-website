import mongoose from "mongoose";

export const connectDB = async ()=> {
    try {
        mongoose.connection.on('connected' , ()=>{
            console.log('MongoDB Connected Successfully');
        })
        await mongoose.connect(process.env.MONGO_URL,{})
    } catch (error) {
        console.log(error.message);
    }
}