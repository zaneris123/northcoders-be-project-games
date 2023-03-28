const db = require("../db/connection.js")

exports.fetchReview = (reviewId) => {
    return db.query(`SELECT * FROM reviews
                    WHERE review_id = $1;`, [reviewId])
            .then((data)=>{
                if(data.rows.length === 0)return Promise.reject({msg: 'Review ID not found', status:404})
                else return data.rows[0]
            })
}