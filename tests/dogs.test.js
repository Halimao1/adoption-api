const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");

const app = require("../app");
const User = require("../models/User");
const Dog = require("../models/Dog");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Dog Routes", function () {
  let token;
  let user;
  let dog;

  before(async function () {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  beforeEach(async function () {
    await Dog.deleteMany({});
    await User.deleteMany({});

    // Register user
    await chai.request(app).post("/api/auth/register").send({
      username: "owner",
      password: "password123",
    });

    // Login
    const login = await chai.request(app).post("/api/auth/login").send({
      username: "owner",
      password: "password123",
    });

    token = login.body.token;

    user = await User.findOne({ username: "owner" });

    // Create one dog
    dog = await Dog.create({
      name: "Haku",
      description: "Friendly dog",
      owner: user._id,
    });
  });

  after(async function () {
    await Dog.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/dogs", function () {
    it("registers a dog", async function () {
      const res = await chai
        .request(app)
        .post("/api/dogs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Bella",
          description: "Happy dog",
        });

      expect(res).to.have.status(201);
      expect(res.body.dog.name).to.equal("Bella");
    });

    it("requires a token", async function () {
      const res = await chai.request(app).post("/api/dogs").send({
        name: "Bella",
        description: "Happy dog",
      });

      expect(res).to.have.status(401);
    });
  });

  describe("GET /api/dogs/registered", function () {
    it("returns registered dogs", async function () {
      const res = await chai
        .request(app)
        .get("/api/dogs/registered")
        .set("Authorization", `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.dogs).to.have.lengthOf(1);
    });
  });

  describe("PATCH /api/dogs/:dogId/adopt", function () {
    it("adopts a dog", async function () {
      // Create adopter
      await chai.request(app).post("/api/auth/register").send({
        username: "adopter",
        password: "password123",
      });

      const login = await chai.request(app).post("/api/auth/login").send({
        username: "adopter",
        password: "password123",
      });

      const adopterToken = login.body.token;

      const res = await chai
        .request(app)
        .patch(`/api/dogs/${dog._id}/adopt`)
        .set("Authorization", `Bearer ${adopterToken}`)
        .send({
          thankYouMessage: "Thank you!",
        });

      expect(res).to.have.status(200);
      expect(res.body.dog.status).to.equal("adopted");
    });
  });

  describe("DELETE /api/dogs/:dogId", function () {
    it("deletes a dog", async function () {
      const res = await chai
        .request(app)
        .delete(`/api/dogs/${dog._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res).to.have.status(200);

      const deletedDog = await Dog.findById(dog._id);

      expect(deletedDog).to.equal(null);
    });
  });

  describe("GET /api/dogs/adopted", function () {
    it("returns adopted dogs", async function () {
      // Create adopter
      await chai.request(app).post("/api/auth/register").send({
        username: "adopter",
        password: "password123",
      });

      const login = await chai.request(app).post("/api/auth/login").send({
        username: "adopter",
        password: "password123",
      });

      const adopterToken = login.body.token;

      await chai
        .request(app)
        .patch(`/api/dogs/${dog._id}/adopt`)
        .set("Authorization", `Bearer ${adopterToken}`)
        .send({
          thankYouMessage: "Thank you!",
        });

      const res = await chai
        .request(app)
        .get("/api/dogs/adopted")
        .set("Authorization", `Bearer ${adopterToken}`);

      expect(res).to.have.status(200);
      expect(res.body.dogs).to.have.lengthOf(1);
    });
  });
});
