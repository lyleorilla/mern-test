export const logger = (req, res, next) => {
    const date = new Date()
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`
    const timeStampt = date.toLocaleString()
    console.log(`[ ${timeStampt} ], Method: ${req.method}, Url: ${fullUrl}`)
    next()
}