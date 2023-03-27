const express = require("express")
const {getAllCategories} = require("./controllers/categories.controller.js")
const {errorHandler} = require("./controllers/error.controller.js")

const app = express();

app.get("/api/categories", getAllCategories)

app.all('*', (req, res) =>{
    res.status(404).send({msg: "page not found"})
})

app.use(errorHandler)

app.use((err, req, res, next)=>{
    res.status(500)
})

module.exports = app;