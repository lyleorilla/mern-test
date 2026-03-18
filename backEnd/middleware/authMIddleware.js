import jwt from "jsonwebtoken"

export const authToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if(!token) {
        const error = new Error("TOKEN NOT FOUND")
        error.status = 401
        return next(error)
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        try {
            if(err){
                const error = new Error("AUTHENTICATION SIGNATURE NOT MATCH")
                error.status = 403
                return next(error)
                
            }
            req.user = data
            next()
        } catch (error) {
            next(error)
        }
    })
}