export const loggerError = (error, req, res, next) => {
    console.log(`ERROR: ${error.message || `INTERNAL SERVER ERROR`}, STATUS: ${error.status || 500}`)
    res.status(error.status || 500).json({
        message: error.message || `INTERNAL SERVER ERROR`,
        status: error.status || 500,
        url: error.url
    })
};
