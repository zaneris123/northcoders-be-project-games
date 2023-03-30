const {fetchCommentsByReview, insertCommentById, removeComments} = require("../models/comments.model.js")
const {fetchReview} = require("../models/reviews.model.js")

exports.getCommentsByReview = (req, res, next) => {
    Promise.all([fetchReview(req.params.id),fetchCommentsByReview(req.params.id)])
    .then((Data)=>{
        res.status(200).send({comments: Data[1]})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.postComments = (req, res, next) => {
    Promise.all([fetchReview(req.params.id),insertCommentById(req.body,req.params.id)])
    .then((Data)=>{
        res.status(201).send({comment: Data[1]})
    })
    .catch((err)=>{
        next(err)
    })
}

exports.deleteComments = (req, res, next) => {
    removeComments(req.params.id)
    .then((Data)=>{
        res.status(204).send("")
    })
    .catch((err)=>{
        next(err)
    })
}