const {fetchCommentsByReview} = require("../models/comments.model.js")
const {fetchReview} = require("../models/reviews.model.js")

exports.getCommentsByReview = (req, res, next) => {
    fetchReview(req.params.id)
        .catch((err)=>{
            next(err)
        })
    fetchCommentsByReview(req.params.id)
        .then((commentsData)=>{
            res.status(200).send({comments: commentsData})
        })
        .catch((err)=>{
            next(err)
        })
}