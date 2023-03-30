const db = require("../db/connection.js")

exports.fetchAllComments = () => {
    return db.query(`SELECT * FROM users;`)
        .then((data)=>{
            return data.rows
        })
}