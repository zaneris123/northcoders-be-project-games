const {fetchReview, fetchAllReviews, updateReviews} = require("../models/reviews.model.js")

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
    fetchAllReviews(req.query)
        .then((reviewData)=>{
            res.status(200).send({reviews: reviewData})
        })
        .catch((err)=>{
            next(err)
        })
}
exports.patchReviews = (req, res, next) => {
    Promise.all([fetchReview(req.params.id),updateReviews(req.body,req.params.id)])
        .then((Data)=>{
            res.status(200).send({review: Data[1]})
        })
        .catch((err)=>{
            next(err)
        })
}