exports.errorHandler = (err, req, res, next) => {
    if(err.status && err.msg){
        console.log("ERROR HANDLER", err)
        res.status(err.status).send({msg: err.msg})
    } else if (err.code === "22P02"){
        res.status(400).send({msg: "Invalid entry"})
    }
    next(err)
}