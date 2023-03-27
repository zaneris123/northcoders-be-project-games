const {fetchReview} = require("../models/reviews.model.js")


exports.getReviews = (req, res, next) => {
    fetchReview(req.params.id)
        .then((reviewData)=>{
            res.status(200).send(reviewData)
        })
        .catch((err)=>{
            next(err)
        })
}