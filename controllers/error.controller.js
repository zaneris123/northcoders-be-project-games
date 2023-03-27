exports.errorHandler = (err, req, res, next) => {
    console.log(err.status)
}