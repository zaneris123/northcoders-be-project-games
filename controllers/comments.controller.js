const {fetchCommentsByReview} = require("../models/comments.model.js")
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