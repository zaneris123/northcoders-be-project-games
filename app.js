const express = require("express")
const {getAllCategories} = require("./controllers/categories.controller.js")
const {getReviews, getAllReviews} = require("./controllers/reviews.controller.js")
const {errorHandler} = require("./controllers/error.controller.js")
const {getCommentsByReview, postComments} = require("./controllers/comments.controller.js")


const app = express()
app.use(express.json())

app.get("/api/categories", getAllCategories)
app.get("/api/reviews/:id", getReviews)
app.get("/api/reviews", getAllReviews)
app.get("/api/reviews/:id/comments", getCommentsByReview)
app.post("/api/reviews/:id/comments", postComments)

app.all('*', (req, res) =>{
    res.status(404).send({msg: "page not found"})
})

app.use(errorHandler)

app.use((err, req, res, next)=>{
    res.status(500)
})

module.exports = app;