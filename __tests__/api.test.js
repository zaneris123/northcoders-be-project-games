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

describe("GET, Reviews by ID",()=>{
    test("200: recieved specified review by ID",()=>{
        return request(app)
            .get("/api/reviews/3")
            .expect(200)
            .then(({body})=>{
                expect(body.review).toMatchObject({
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
            expect(body).toEqual({msg:"Invalid entry"})
        })
    })
})

describe("GET, Reviews",()=>{
    test("200: recieved list of reviews in array", () =>{
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({body})=>{
                expect(body.reviews).toHaveLength(data.reviewData.length)
                body.reviews.forEach(reviewEntry =>{
                    expect(reviewEntry).toMatchObject({
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(Number),
                        category: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        designer: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                })
            })
    })
    test("200: correct comment count",()=>{
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({body})=>{
                const reviewid1 = body.reviews.filter(review => review.review_id===1)[0]
                const reviewid2 = body.reviews.filter(review => review.review_id===2)[0]
                expect(reviewid1).toMatchObject({
                    comment_count: 0
                })
                expect(reviewid2).toMatchObject({
                    comment_count: 3
                })
            })
    })
    test("200: recieved list is sorted by date (Descending)",()=>{
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({body})=>{;
                expect(body.reviews).toBeSortedBy("created_at", {descending: true})
            })
    })
    test("404: Incorrect url, not found",()=>{
        request(app)
        .get("/api/review")
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("page not found")
        })
    })
})

describe("GET, Recieved list of comments by Review ID",()=>{
    test("200: recieved list of comments",()=>{
        return request(app)
            .get("/api/reviews/2/comments")
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toHaveLength(3)
                body.comments.forEach(commentEntry => {
                expect(commentEntry).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    review_id: 2
                    })
                })
            })
    })
    test("200: Recieve empty array",()=>{
        return request(app)
            .get("/api/reviews/1/comments")
            .expect(200)
            .then(({body})=>{
                expect(body.comments).toHaveLength(0)
            })
    })
    test("404: Error for when review ID does not exist",()=>{
        return request(app)
            .get("/api/reviews/1000/comments")
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("Review ID not found")
            })
    })
    test("400: Invalid review ID",()=>{
        return request(app)
            .get("/api/reviews/notanid/comments")
            .expect(400)
            .then(({body})=>{
                expect(body).toEqual({msg:"Invalid entry"})
            })
    })
})
