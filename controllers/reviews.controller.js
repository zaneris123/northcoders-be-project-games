const {fetchReview, fetchAllReviews} = require("../models/reviews.model.js")


exports.getReviews = (req, res, next) => {
    fetchReview(req.params.id)
        .then((reviewData)=>{
            res.status(200).send({review: reviewData})
        })
        .catch((err)=>{
            next(err)
        })
}
exports.getAllReviews = (req, res, next) => {
    fetchAllReviews()
        .then((reviewData)=>{
            res.status(200).send({reviews: reviewData})
        })
        .catch((err)=>{
            next(err)
        })
}