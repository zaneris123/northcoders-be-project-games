const db = require("../db/connection.js")

exports.fetchCommentsByReview = (reviewId) => {
    return db.query(`SELECT * FROM comments
                    WHERE review_id = $1 ORDER BY created_at DESC`, [reviewId])
            .then((data)=>{
                return data.rows
            })
}

exports.insertCommentById = (bodyObj, reviewId) => {

    const inputArray = [bodyObj.username,bodyObj.body, reviewId]
    return db.query(`INSERT INTO comments
                    (author, body, review_id) 
                    VALUES ($1, $2, $3)
                    RETURNING *;`, inputArray)
            .then((data)=>{
                    return data.rows[0]
            })
}