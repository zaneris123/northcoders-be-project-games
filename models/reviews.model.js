const db = require("../db/connection.js")

exports.fetchReview = (reviewId) => {
    if(!/^\d+$/.test(reviewId)) {
        return Promise.reject({msg: 'Invalid review ID', status:400})
    }

    return db.query(`SELECT * FROM reviews
                    WHERE review_id = $1;`, [reviewId])
            .then((data)=>{
                if(data.rows.length === 0)return Promise.reject({msg: 'Invalid review ID', status:400})
                else return data.rows[0]
            })
}