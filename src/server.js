import express from "express";
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
import filesRouter from "./services/files/index.js";

import { join } from "path";

const server = express();

const port = 3001;
const publicFolderPath = join(process.cwd(), "./public");
const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request method: ${req.method} --- URL ${req.url} --- ${new Date()}`
  );
  req.name = "Diego";
  next();
};

server.use(express.static(publicFolderPath));
server.use(loggerMiddleware);
server.use(cors());
server.use(express.json());
server.use("/authors", loggerMiddleware, authorsRouter);
server.use("/blogposts", blogpostsRouter);
server.use("/files", filesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);
console.table(listEndpoints(server));
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
