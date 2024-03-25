const express = require("express");
const apiRouter = express.Router();

apiRouter.use("/articles", require("./article.router"));
apiRouter.use("/product", require("./product.router"));
apiRouter.use("/review", require("./review.router"))
apiRouter.get("/", (req, res, next) => res.status(200).json({
  statusCode: 200,
  msg: "Welcome to forcat api",
}))

const route = app => {
  app.use("/api", apiRouter);
  app.use((req, res) => {
    res.status(404).json({
      message: "Not found",
      statusCode: 404,
    });
  });
}

module.exports = route;