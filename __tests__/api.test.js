const request = require("supertest")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")
const app = require("../app.js")

const db = require("../db/connection.js")

afterAll(() => db.end())

beforeEach(() => seed(data))

describe("GET, Categories",()=>{
    test("200: recieved list of treasures",()=>{
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({body}) => {
                expect(body.categories).toHaveLength(data.categoryData.length)
                body.categories.forEach(categoryEntry => {
                    expect(categoryEntry).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
    })
    test("404: invalid url page not found",()=>{
        return request(app)
            .get("/api/category")
            .expect(404)
    })
})