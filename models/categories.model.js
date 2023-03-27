const db = require("../db/connection.js")

exports.fetchAllCategories = () => {
    return db.query("SELECT * FROM categories;")
        .then(data => {
            return {categories: data.rows}
        })
        .catch((err) =>{
            next(err)
        })
}