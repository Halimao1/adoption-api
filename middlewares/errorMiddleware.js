function notFoundHandler(req, res) {
  return res.status(404).json({
    message: "Route not found",
  });
}

function errorHandler(error, req, res, next) {
  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Internal server error",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
