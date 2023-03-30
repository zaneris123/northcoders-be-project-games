exports.errorHandler = (err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    } else if (err.code === "22P02"){
        res.status(400).send({msg: "Invalid entry"})
    } else if (err.code === "23502"){
        res.status(400).send({msg: "Invalid post"})
    } else if (err.code === "23503"){
        res.status(404).send({msg: "Username not found"})
    }
    next(err)
}