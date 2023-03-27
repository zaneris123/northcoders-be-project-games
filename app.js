const express = require("express")
const {getAllCategories} = require("./controllers/categories.controller.js")
const {errorHandler} = require("./controllers/error.controller.js")

const app = express();

app.get("/api/categories", getAllCategories)

app.use(errorHandler)

module.exports = app;