const {fetchAllCategories} = require("../models/categories.model.js")

exports.getAllCategories = (req, res, next) => {
    fetchAllCategories()
        .then((categoryData) =>{
            res.status(200).send(categoryData)
        })
        .catch(err => next(err))
}