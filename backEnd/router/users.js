import express from "express"
import { postCreateUser, postDeleteUser, postLoginUser, postUserData, postHandleRefreshToken } from "../controller/user-controller.js"
import { authToken } from "../middleware/authMIddleware.js"
export const userRouter = express.Router()


userRouter.post("/create/", postCreateUser)
userRouter.post("/login/", postLoginUser)
userRouter.post("/refresh-token/", postHandleRefreshToken)
userRouter.post("/user-data/", authToken, postUserData)

userRouter.post("/delete/", postDeleteUser)