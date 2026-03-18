import mongoose from "mongoose";

export const connectDB = async () => {
    console.log("running")
    const connection = await mongoose.connect(process.env.MONGO_URI)
    console.log("DB CONNECTED")
}