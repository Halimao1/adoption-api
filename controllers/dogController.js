const Dog = require("../models/Dog");

async function registerDog(req, res, next) {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "Name and description are required",
      });
    }

    const dog = await Dog.create({
      name,
      description,
      owner: req.user.userId,
    });

    return res.status(201).json({
      message: "Dog registered successfully",
      dog,
    });
  } catch (error) {
    next(error);
  }
}

async function getRegisteredDogs(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Page and limit must be positive numbers",
      });
    }

    if (status && !["available", "adopted"].includes(status)) {
      return res.status(400).json({
        message: "Status must be available or adopted",
      });
    }

    const filter = {
      owner: req.user.userId,
    };

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const dogs = await Dog.find(filter).skip(skip).limit(limit);

    const totalDogs = await Dog.countDocuments(filter);

    return res.json({
      dogs,
      pagination: {
        page,
        limit,
        totalDogs,
        totalPages: Math.ceil(totalDogs / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function adoptDog(req, res, next) {
  try {
    const { dogId } = req.params;
    const { thankYouMessage } = req.body;

    if (!thankYouMessage) {
      return res.status(400).json({
        message: "Thank-you message is required",
      });
    }

    const dog = await Dog.findById(dogId);

    if (!dog) {
      return res.status(404).json({
        message: "Dog not found",
      });
    }

    if (dog.status === "adopted") {
      return res.status(409).json({
        message: "Dog has already been adopted",
      });
    }

    if (dog.owner.toString() === req.user.userId) {
      return res.status(403).json({
        message: "You cannot adopt your own dog",
      });
    }

    dog.status = "adopted";
    dog.adopter = req.user.userId;
    dog.thankYouMessage = thankYouMessage;

    await dog.save();

    return res.json({
      message: "Dog adopted successfully",
      dog,
    });
  } catch (error) {
    next(error);
  }
}

async function removeDog(req, res, next) {
  try {
    const { dogId } = req.params;

    const dog = await Dog.findById(dogId);

    if (!dog) {
      return res.status(404).json({
        message: "Dog not found",
      });
    }

    if (dog.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only remove dogs you registered",
      });
    }

    if (dog.status === "adopted") {
      return res.status(409).json({
        message: "An adopted dog cannot be removed",
      });
    }

    await Dog.findByIdAndDelete(dogId);

    return res.json({
      message: "Dog removed successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function getAdoptedDogs(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        message: "Page and limit must be positive numbers",
      });
    }

    const filter = {
      adopter: req.user.userId,
    };

    const skip = (page - 1) * limit;

    const dogs = await Dog.find(filter).skip(skip).limit(limit);

    const totalDogs = await Dog.countDocuments(filter);

    return res.json({
      dogs,
      pagination: {
        page,
        limit,
        totalDogs,
        totalPages: Math.ceil(totalDogs / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerDog,
  getRegisteredDogs,
  adoptDog,
  removeDog,
  getAdoptedDogs,
};
