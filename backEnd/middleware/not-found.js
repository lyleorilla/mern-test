export const notFound = (req, res, next) => {
    const error = new Error("ROUTES NOT FOUND")
    error.status = 404
    error.url = `${req.protocol}://${req.get("host")}${req.originalUrl}`
    next(error)
}