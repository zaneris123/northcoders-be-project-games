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
    test("200: list of comments are in reverse chronological order",()=>{
        return request(app)
            .get("/api/reviews/2/comments")
            .expect(({body})=>{
                expect(body.comments).toBeSortedBy("created_at", {descending: true})
            })
    })
    test("200: Recieve empty array for review with no comments",()=>{
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

describe("POST: user can post comments to reviews",()=>{
    test("201: comment is posted",()=>{
        const testComment = {
            "username":"mallionaire",
            "body":"What a great and indepth review of something I have nothing to say about as I have no context of what I am actually commenting on yes."
        }
        return request(app)
            .post("/api/reviews/1/comments")
            .send(testComment)
            .expect(201)
            .then(({body})=>{
                expect(body.comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: testComment.username,
                        body: testComment.body,
                        review_id: 1
                })
            })
    })
    test("201: Ignores others properties",()=>{
        const testComment = {
            "username":"mallionaire",
            "unneededprop": 3,
            "body":"What a great and indepth review of something I have nothing to say about as I have no context of what I am actually commenting on yes."
        }
        return request(app)
        .post("/api/reviews/1/comments")
        .send(testComment)
        .expect(201)
        .then(({body})=>{
            expect(body.comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: testComment.username,
                    body: testComment.body,
                    review_id: 1
            })
        })
    })
    test("400: invalid post structure",()=>{
        const badTestComment = {
            "username":"mallionaire",
            "notABody":"What a great and indepth review of something I have nothing to say about as I have no context of what I am actually commenting on yes."
        }
        return request(app)
            .post("/api/reviews/1/comments")
            .send(badTestComment)
            .expect(400)
            .then(({body})=>{
                expect(body).toEqual({msg: "Invalid post"})
            })
    })
    test("400: invalid user name",()=>{
        const badTestComment = {
            "username":"notauser",
            "body":"my post that i really wanna post"
        }
        return request(app)
            .post("/api/reviews/1/comments")
            .send(badTestComment)
            .expect(404)
            .then(({body})=>{
                expect(body).toEqual({msg: "Username not found"})
            })
    })
    test("404: review id not found",()=>{
        const testComment = {
            "username":"mallionaire",
            "body":"What a great and indepth review of something I have nothing to say about as I have no context of what I am actually commenting on yes."
        }
        return request(app)
            .post("/api/reviews/12131/comments")
            .send(testComment)
            .expect(404)
            .then(({body})=>{
                expect(body).toEqual({msg: "Review ID not found"})
            })
    })
    test("400: invalid ID input",()=>{
        const testComment = {
            "username":"mallionaire",
            "body":"What a great and indepth review of something I have nothing to say about as I have no context of what I am actually commenting on yes."
        }
        return request(app)
        .post("/api/reviews/banana/comments")
        .send(testComment)
        .expect(400)
        .then(({body})=>{
            expect(body).toEqual({msg: "Invalid entry"})
        })
    })
})

describe("PATCH: updated reviews votes count",()=>{
    test("200: updates review count, and returns review",()=>{
        const newVote = 3;
        return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: newVote })
        .expect(200)
        .then(({body})=>{
            expect(body.review).toMatchObject({
                review_id: 3,
                title: expect.any(String),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                votes: 8,
                category: expect.any(String),
                owner: expect.any(String),
                created_at: expect.any(String)
            })
        })
    })
    test("200: updates review count, and returns review(negative)",()=>{
        const newVote = -3;
        return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: newVote })
        .expect(200)
        .then(({body})=>{
            expect(body.review).toMatchObject({
                review_id: 3,
                title: expect.any(String),
                review_body: expect.any(String),
                designer: expect.any(String),
                review_img_url: expect.any(String),
                votes: 2,
                category: expect.any(String),
                owner: expect.any(String),
                created_at: expect.any(String)
            })
        })
    })
    test("400: invalid patch request",()=>{
        return request(app)
        .patch("/api/reviews/3")
        .send({ notavote: 3 })
        .expect(400)
        .then(({body})=>{
            expect(body).toEqual({msg:"Invalid patch"})
        })
    })
    test("404: review id not found",()=>{
        return request(app)
        .patch("/api/reviews/9999")
        .send({ inc_votes: 3})
        .expect(404)
        .then(({body})=>{
            expect(body).toEqual({msg:"Review ID not found"})
        })
    })
    test("400: Invalid ID input",()=>{
        return request(app)
        .patch("/api/reviews/badid")
        .send({inc_votes: 3})
        .expect(400)
        .then(({body})=>{
            expect(body).toEqual({msg: "Invalid entry"})
        })
    })
    test("400: Invalid entry in votes",()=>{
        return request(app)
        .patch("/api/reviews/3")
        .send({inc_votes: "notanum"})
        .expect(400)
        .then(({body})=>{
            expect(body).toEqual({msg: "Invalid entry"})
        })
    })
})

describe("DELETE: removes comment by id",()=>{
    test("204: removes comment",()=>{
        return request(app)
        .delete("/api/comments/3")
        .expect(204)
    })
    test("404: Invalid comment Id",()=>{
        return request(app)
        .delete("/api/comments/9999")
        .expect(404)
        .then(({body})=>{
            expect(body).toEqual({msg: "Invalid comment ID"})
        })
    })
    test("400: Invalid comment entry",()=>{
        return request(app)
        .delete("/api/comments/dskad")
        .expect(400)
        .then(({body})=>{
            expect(body).toEqual({msg: "Invalid entry"})
        })
    })
})

describe("GET list of users",()=>{
    test("200: recieve list of users",()=>{
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body})=>{
            expect(body.users).toHaveLength(data.userData.length)
            body.users.forEach((user)=>{
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
    test("404: invalid url",()=>{
        return request(app)
        .get("/api/usrs")
        .expect(404)
        .then(({body})=>{
            expect(body).toEqual({msg: "page not found"})
        })
    })
})

describe("GET reviews query testing",()=>{
    test("200: recieve list of reviews filtered by category (category = social deduction)",()=>{
        const filteredLength = data.reviewData.filter(review => review.category === "social deduction").length
        return request(app)
        .get("/api/reviews?category=social_deduction")
        .expect(200)
        .then(({body})=>{
            expect(body.reviews).toHaveLength(filteredLength)
            body.reviews.forEach((review)=>{
                expect(review).toMatchObject({
                    owner: expect.any(String),
                    title: expect.any(String),
                    review_id: expect.any(Number),
                    category: "social deduction",
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    designer: expect.any(String),
                    comment_count: expect.any(Number)
                })
            })
        })
    })

    test("200: defaults to create at order DESC",()=>{
        return request(app)
        .get("/api/reviews?category=social_deduction")
        .expect(200)
        .then(({body})=>{
            expect(body.reviews).toBeSortedBy("created_at", {descending: true})
        })
    })

    test("200: recieve empty array for known category that dont have reviews",()=>{
        return request(app)
        .get("/api/reviews?category=childrens_games")
        .expect(200)
        .then(({body})=>{
            expect(body.reviews).toHaveLength(0)
        })
    })

    test("404: recieve error for for unknown category",()=>{
        return request(app)
        .get("/api/reviews?category=notacategory")
        .expect(404)
        .then(({body})=>{
            expect(body).toEqual({msg: "Category not found"})
        })
    })

    test("200: recieve array ordered by specified order (default desc)",()=>{
        return request(app)
        .get("/api/reviews?order_by=votes")
        .expect(200)
        .then(({body})=>{
            expect(body.reviews).toBeSortedBy("votes", {descending: true})
        })
    })

    test("400: Invalid order by query",()=>{
        return request(app)
        .get("/api/reviews?order_by=banana")
        .expect(400)
        .then(({body})=>{
            expect(body).toEqual({msg: "Invalid order_by query"})
        })
    })

    test("200: recieve array that ordereded by ASC when specified",()=>{
        return request(app)
        .get("/api/reviews?order=ASC")
        .expect(200)
        .then(({body})=>{
            expect(body.reviews).toBeSortedBy("created_at", {descending: false})
        })
    })

    test("400: error for wrong ordering",()=>{
        return request(app)
        .get("/api/reviews?order=notaordering")
        .expect(400)
        .then(({body})=>{
            expect(body).toEqual({msg: "Invalid order query"})
        })
    })

    test("CC-C-Combo query. filters and sorts by ascending",()=>{
        return request(app)
        .get("/api/reviews?category=social_deduction&&order_by=votes&&order=ASC")
        .expect(200)
        .then(({body})=>{
            expect(body.reviews).toBeSortedBy("votes", {descending: false})
            body.reviews.forEach((review)=>{
                expect(review).toMatchObject({
                    category: "social deduction"
                })
            })
        })
    })
    
    describe("GET review by id, Comment count is included in specific reviews",()=>{
        
    test("200: recieve review by id, with comment count",()=>{
        return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({body})=>{
            expect(body.review).toMatchObject({
                comment_count: 3,
                review_id: 2,
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

    test("200: recieve review by id, with comment count even when 0 comments",()=>{
        return request(app)
        .get("/api/reviews/5")
        .expect(200)
        .then(({body})=>{
            expect(body.review).toMatchObject({
                comment_count: 0,
                review_id: 5,
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
    })
})