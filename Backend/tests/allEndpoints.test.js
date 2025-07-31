const request = require("supertest");
const app = require("../server"); // your Express app exported from app.js

let token = ""; // to store JWT token after login

describe("AI-Sensei Backend API Endpoints Automation", () => {
  // 1. Register a user (run once — fails if user exists)
  test("POST /api/auth/register - Register new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "testuser@example.com",
      password: "TestPass123!",
      name: "Test User",
    });
    // It might fail if user already exists, so allow either 200 or 400 here
    expect([200, 400]).toContain(res.statusCode);
  });

  // 2. Login to get JWT token
  test("POST /api/auth/login - User login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "TestPass123!",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  // 3. Get user profile (authenticated)
  test("GET /api/user/profile - Get user profile", async () => {
    const res = await request(app)
      .get("/api/user/profile")
      .set("x-auth-token", token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", "testuser@example.com");
  });

  // 4. Update user profile
  test("PUT /api/user/profile - Update user profile", async () => {
    const res = await request(app)
      .put("/api/user/profile")
      .set("x-auth-token", token)
      .send({ name: "Updated Test User", jlptLevel: "N4" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("msg", "Profile updated");
  });

  // 5. AI Teacher endpoint (ask question)
  test("POST /api/ai/teacher - AI teacher question", async () => {
    const res = await request(app)
      .post("/api/ai/teacher")
      .set("x-auth-token", token)
      .send({ question: "Explain こんにちは in Japanese." });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("answer");
  });

  // 6. AI Doubt Solver endpoint
  test("POST /api/ai/doubt-solver - AI doubt solving", async () => {
    const res = await request(app)
      .post("/api/ai/doubt-solver")
      .set("x-auth-token", token)
      .send({ doubt: "What is the particle は?" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("answer");
  });

test("GET /api/dictionary/search?q=doko - Search dictionary", async () => {
  const res = await request(app)
    .get("/api/dictionary/search")
    .query({ q: "doko" })
    .set("x-auth-token", token);

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true); // res.body is now an array directly
});

  // 8. Word of the day (public)
  // test("GET /api/dictionary/word-of-day - Get word of the day", async () => {
  //   const res = await request(app).get("/api/dictionary/word-of-day");
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body).toHaveProperty("word");
  // });

  // 9. Get all roadmaps
  test("GET /api/roadmaps - List JLPT roadmaps", async () => {
    const res = await request(app)
      .get("/api/roadmaps")
      .set("x-auth-token", token);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 10. Enroll in a roadmap (use first roadmap id if exists)
  test("POST /api/roadmaps/enroll/:id - Enroll in roadmap", async () => {
    const roadmapsRes = await request(app)
      .get("/api/roadmaps")
      .set("x-auth-token", token);
    if (roadmapsRes.body.length === 0) {
      return Promise.resolve(); // Skip test if no roadmap
    }

    const roadmapId = roadmapsRes.body[0]._id;
    const res = await request(app)
      .post(`/api/roadmaps/enroll/${roadmapId}`)
      .set("x-auth-token", token);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });

  // 11. Get quiz of a level
  // test("GET /api/quiz/N5 - Get quiz for level N5", async () => {
  //   const res = await request(app)
  //     .get("/api/quiz/N5")
  //     .set("x-auth-token", token);
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body).toHaveProperty("title");
  // });

  // 12. Submit quiz (simple mock)
  // test("POST /api/quiz/submit - Submit quiz results", async () => {
  //   const res = await request(app)
  //     .post("/api/quiz/submit")
  //     .set("x-auth-token", token)
  //     .send({ quizId: "sampleQuizId", answers: ["a", "b", "c"] });
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body).toHaveProperty("score");
  // });

  // 13. Get user interaction/history
  test("GET /api/history - Get user AI interactions", async () => {
    const res = await request(app)
      .get("/api/history")
      .set("x-auth-token", token);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
