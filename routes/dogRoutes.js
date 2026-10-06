const express = require("express");

const authenticateUser = require("../middlewares/authMiddleware");

const {
  registerDog,
  getRegisteredDogs,
  adoptDog,
  removeDog,
  getAdoptedDogs,
} = require("../controllers/dogController");

const router = express.Router();

router.post("/", authenticateUser, registerDog);

router.get("/registered", authenticateUser, getRegisteredDogs);

router.get("/adopted", authenticateUser, getAdoptedDogs);

router.patch("/:dogId/adopt", authenticateUser, adoptDog);

router.delete("/:dogId", authenticateUser, removeDog);

module.exports = router;
