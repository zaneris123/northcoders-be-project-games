const {fetchAllComments} = require("../models/users.model.js")

exports.getAllUsers = (req, res, next) => {
    fetchAllComments()
    .then((userData)=>{
        res.status(200).send({users: userData})
    })
    .catch((err)=>{
        next(err)
    })
}