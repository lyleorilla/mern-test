import express from "express"
import cookieParser from "cookie-parser"
import { connectDB } from "./config/connection.js"
import { userRouter } from "./router/users.js"
import { logger } from "./middleware/user-logger.js"
import { loggerError } from "./middleware/logger-error.js"
import { notFound } from "./middleware/not-found.js"


const PORT = process.env.PORT || 5000
const app = express()

//middleware
app.use(logger)

// translate json to js objects
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

// run when request match /users/
app.use("/users/", userRouter)
app.get("/refresh", )

// Handle server error/ throw error logger
app.use(notFound)

// random request would trigger this
app.use(loggerError)

const startUp = async () => {
    try {
        await connectDB()
        
        app.listen(PORT, () => console.log(process.env.PORT))
    } catch (error) {
        console.error("HOST STARTUP FAILED:", error.message)
        
        process.exit(1)
    }
}
startUp()