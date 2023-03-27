const request = require("supertest")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")
const app = require("../app.js")

const connection = require("../db/connection.js")

afterAll(() => connection.end())

beforeEach(() => seed(data))

describe("GET, Categories",()=>{
    test("200: recieved list of treasures",()=>{
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({body}) => {
                expect(body).toHaveLength(data.categoryData.length)
                body.forEach(categoryEntry => {
                    expect(categoryEntry).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
    })
})