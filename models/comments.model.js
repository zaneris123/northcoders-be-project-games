const db = require("../db/connection.js")

exports.fetchCommentsByReview = (reviewId) => {
    return db.query(`SELECT * FROM comments
                    WHERE review_id = $1 ORDER BY created_at DESC`, [reviewId])
            .then((data)=>{
                return data.rows
            })
}