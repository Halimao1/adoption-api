const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");

const app = require("../app");
const User = require("../models/User");

chai.use(chaiHttp);

const expect = chai.expect;

describe("Authentication Routes", function () {
  before(async function () {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  beforeEach(async function () {
    await User.deleteMany({});
  });

  after(async function () {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/auth/register", function () {
    it("registers a new user", async function () {
      const response = await chai.request(app).post("/api/auth/register").send({
        username: "halima",
        password: "password123",
      });

      expect(response).to.have.status(201);
      expect(response.body.message).to.equal("User registered successfully");

      const user = await User.findOne({
        username: "halima",
      });

      expect(user).to.exist;
      expect(user.password).to.not.equal("password123");
    });

    it("rejects missing registration information", async function () {
      const response = await chai.request(app).post("/api/auth/register").send({
        username: "halima",
      });

      expect(response).to.have.status(400);
      expect(response.body.message).to.equal(
        "Username and password are required",
      );
    });

    it("rejects a duplicate username", async function () {
      await chai.request(app).post("/api/auth/register").send({
        username: "halima",
        password: "password123",
      });

      const response = await chai.request(app).post("/api/auth/register").send({
        username: "halima",
        password: "anotherPassword",
      });

      expect(response).to.have.status(409);
      expect(response.body.message).to.equal("Username already exists");
    });
  });

  describe("POST /api/auth/login", function () {
    beforeEach(async function () {
      await chai.request(app).post("/api/auth/register").send({
        username: "halima",
        password: "password123",
      });
    });

    it("logs in a user and returns a token", async function () {
      const response = await chai.request(app).post("/api/auth/login").send({
        username: "halima",
        password: "password123",
      });

      expect(response).to.have.status(200);
      expect(response.body.token).to.be.a("string");
    });

    it("rejects an incorrect password", async function () {
      const response = await chai.request(app).post("/api/auth/login").send({
        username: "halima",
        password: "wrongPassword",
      });

      expect(response).to.have.status(401);
      expect(response.body.message).to.equal("Invalid username or password");
    });
  });
});
