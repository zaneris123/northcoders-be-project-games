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

describe("GET, reviews by ID",()=>{
    test("200: recieved specified review by ID",()=>{
        return request(app)
            .get("/api/reviews/3")
            .expect(200)
            .then(({body})=>{
                expect(body).toMatchObject({
                    review_id: 3,
                    title: expect.any(String),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: expect.any(Number),
                    category: expect.any(String),
                    owner: expect.any(String),
                    created_at: expect.any(String)
                })
            })
    })
    test("404: Error when review ID does not exist.",()=>{
        return request(app)
            .get("/api/reviews/300")
            .expect(404)
            .then(({body})=>{
                expect(body).toEqual({msg:"Review ID not found"})
            })
    })
    test("400: Invalid review ID",()=>{
        return request(app)
        .get("/api/reviews/reallybadentry")
        .expect(400)
        .then(({body})=>{
            expect(body).toEqual({msg:"Invalid review ID"})
        })
    })
})

