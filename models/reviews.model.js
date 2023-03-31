const db = require("../db/connection.js")

exports.fetchReview = (reviewId) => {
    return db.query(`SELECT * FROM reviews
                    WHERE review_id = $1;`, [reviewId])
            .then((data)=>{
                if(data.rows.length === 0)return Promise.reject({msg: 'Review ID not found', status:404})
                else return data.rows[0]
            })
}
exports.fetchAllReviews = (query) => {
    return db.query(`SELECT slug FROM categories`)
        .then((categoryData)=>{
            let categoryArr = categoryData.rows.map(category => category.slug.replaceAll("'",""))

            let queryString = "SELECT CAST(COUNT(b.review_id) AS INTEGER) AS comment_count, a.owner, a.title, a.review_id, a.category, a.review_img_url, a.created_at, a.votes, a.designer FROM reviews a FULL OUTER JOIN comments b ON b.review_id = a.review_id"
            
            if(query.category){
                let categoryStr = query.category.replaceAll('_', ' ')
                if(!categoryArr.includes(categoryStr))return Promise.reject({msg:"Category not found",status:404})
                else queryString += ` WHERE a.category like '${categoryStr}'`
            }
            queryString += " GROUP BY a.review_id"

            if(query.order_by){
                let columnsArr = ["owner","title","review_id","category","review_img_url","create_at","votes","designer"]
                if (!columnsArr.includes(query.order_by)){
                    return Promise.reject({msg:"Invalid order_by query",status:400})
                } else {
                    queryString += ` ORDER BY a.${query.order_by}`
                }
            }
            else queryString +=  " ORDER BY a.created_at"

            if(query.order){
                if (query.order === "ASC" || query.order === "DESC") queryString += ` ${query.order}`
                else return Promise.reject({msg: "Invalid order query", status: 400})
            }
            else queryString += " DESC"

            queryString += `;`
            return db.query(queryString)
                .then((data)=> data.rows)
        })

}

exports.updateReviews = (bodyObj, reviewId) => {
    if(!bodyObj.inc_votes)return Promise.reject({msg:"Invalid patch",status:400})
    const inputArray = [bodyObj.inc_votes, reviewId]
    return db.query(`UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`, inputArray)
        .then((data)=> data.rows[0])
}