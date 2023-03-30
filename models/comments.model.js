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

exports.removeComments = (commentId) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,[commentId])
        .then((data)=>{
            if(data.rows.length === 0) return Promise.reject({msg: "Invalid comment ID", status: 404})
        })
}