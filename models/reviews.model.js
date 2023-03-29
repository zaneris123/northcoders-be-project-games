const db = require("../db/connection.js")

exports.fetchReview = (reviewId) => {
    return db.query(`SELECT * FROM reviews
                    WHERE review_id = $1;`, [reviewId])
            .then((data)=>{
                if(data.rows.length === 0)return Promise.reject({msg: 'Review ID not found', status:404})
                else return data.rows[0]
            })
}
exports.fetchAllReviews = () => {
    return db.query(`SELECT CAST(COUNT(b.review_id) AS INTEGER) AS comment_count, a.owner, a.title, a.review_id, a.category, a.review_img_url, a.created_at, a.votes, a.designer FROM reviews a FULL OUTER JOIN comments b ON b.review_id = a.review_id GROUP BY a.review_id ORDER BY a.created_at DESC;`)
        .then((data)=> data.rows)
}