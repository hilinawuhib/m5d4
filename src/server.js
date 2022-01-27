import express from "express"; // <-- NEW IMPORT SYNTAX (Enabled with type: "module" in package.json)
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import authorsRouter from "./services/authors/index.js";
import blogpostsRouter from "./services/blogposts/index.js";
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import createHttpError from "http-errors";

const server = express();

const port = 3001;
const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request method: ${req.method} --- URL ${req.url} --- ${new Date()}`
  );
  req.name = "Diego";
  next();
};

const fakeAuthMiddleware = (req, res, next) => {
  if (req.name !== "Diego") res.status(401).send({ message: "Unauthorized" });
  if (req.name !== "Diego")
    next(createHttpError(401, "Non Diego users are not allowed!"));
  else next();
};

server.use(loggerMiddleware);
server.use(cors());
server.use(express.json());
server.use("/authors", loggerMiddleware, authorsRouter);
server.use("/blogposts", blogpostsRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);
console.table(listEndpoints(server));
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
