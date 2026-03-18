import mongoose from "mongoose";
import bcrypt from "bcrypt"

const kittenSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, "A KITTEN MUST HAVE A NAME"],
        minlength: [6, 'MUST BE 6 LENGTH LONG'],
        trim: true,
        unique: true
    },
    password : {
        type: String,
        required: [true, "YOU FORGOT PASSWORD"],
        minlength: [6, 'MUST BE 6 LENGTH LONG']
    }
})

kittenSchema.pre("save", async function () {
    if(!this.isModified("password")) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})
export const Kitten = mongoose.model("Kitten", kittenSchema)