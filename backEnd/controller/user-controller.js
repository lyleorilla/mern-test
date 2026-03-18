import { Kitten } from "../model/animal.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


// POST /users/login/
export const postLoginUser = async (req, res, next) => {
    try {
        
        const {name, password } = req.body || {}
        const user = await Kitten.findOne({name}).select("+password ")
        if(!user || !(await bcrypt.compare(password, user.password))){
            error.status = 401
            const error = new Error("INVALID CREDENTIAL PLEASE TRY AGAIN")
            return next(error)
            
        }
        const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "15m"})
        const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_SECRET, {expiresIn: "7d"})

        res.cookie("refreshCookie", refreshToken, {
            secure: process.env.NODE_ENV === "productions",
            httpOnly: true,
            sameSite: "lax",
            maxAge: 1000 * 7 * 24 * 60 * 60
        })

        res.json({
            success: true,
            message: `YOU ARE LOGIN ${name.toUpperCase()}`,
            data: {
                id: user._id,
                name: user.name,
                accessToken: accessToken
            }
        })

    } catch (error) {
        next(error)
    }
}

// METHOD: POST /users/user-data/

export const postUserData = async (req, res, next) => {

    const id = req.user.id
    const user = await Kitten.findOne({_id: id}).select("+password")
    if(!user){
        const error = new Error("USER NOT FOUND")
        error.status = 404
        return next(error)
    }
    res.json({
        success: true,
        message: `YOU ARE LOGIN ${user.name}`,
        data: {
            id: user._id,
            name: user.name,
            hashPassword: user.password
        }  
    })
}   

// METHOD: POST  /users/create
export const postCreateUser = async (req, res, next) => {
    try {
        const {name, password} = req.body
        if(!name || !password){
            const error = new Error(`NAME / PASSWORD IS MISSING`)
            error.status = 402
            return next(error)
        }
        // const kitten = await Kitten.create({name: req.query.name})    
        const kitten = await new Kitten(req.body).save()
        res.json({
            success: true,
            message: "USER CREATED SUCCESFULLY",
            data: {
                id: kitten._id,
                name: kitten.name
            }
        })
    } catch (error) {
        if(error.code === 11000){
            const err = new Error(`${req.body.name} USERNAME IS ALREADY TAKEN`)
            err.status = 400
            return next(err)    
        }
        next(error)
    }
}

// METHOD: DELETE /users/delete     
export const postDeleteUser = async (req, res, next) => {
    try {
        const {name, password} = req.body
        const user = await Kitten.findOne({name}).select("+password")
        if(!user || !(await bcrypt.compare(password, user.password))){
            const error = new Error("INVALID CREDENTIAL CANNOT DELETE USER")
            error.status = 401
            return next(error)
        }
        await user.deleteOne()
        console.log("DELETE SUCCESFULLY")
        res.json({
            success: true,
            message: `${user.name.toUpperCase()} IS DELETED`,
            data: {
                id: user._id,
                name: user.name,
                password: user.password
            }
        })

    } catch (error) {
        next(error)
    }
}

// METHOD: POST /users/refresh-token/
export const postHandleRefreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshCookie
    if(!refreshToken) {
        const error = new Error("NO REFRESH TOKEN FOUND")
        error.status = 401
        return next(error)
    }
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, data) => {
        if(err){
            const error = new Error("REFRESH TOKEN EXPIRED")
            error.status = 401
            return next(error)
        }
        const accessToken = jwt.sign({id: data.id}, process.env.JWT_SECRET, {expiresIn: "15m"})
        res.json({
            success: true,
            message: `NEW ACCESS TOKEN CREATED`,
            data: {
                accessToken: accessToken
            }
        })
    })
}
