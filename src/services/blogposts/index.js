import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import fs from "fs";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { newBlogpostValidation } from "./validation.js";

const blogpostsRouter = express.Router();
const blogpostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogposts.json"
);

const getblogposts = () => JSON.parse(fs.readFileSync(blogpostsJSONPath));
const writeblogposts = (content) =>
  fs.writeFileSync(blogpostsJSONPath, JSON.stringify(content));

blogpostsRouter.post("/", newBlogpostValidation, (req, res, next) => {
  try {
    const newblogpost = { ...req.body, createdAt: new Date(), id: uniqid() };
    const errorsList = validationResult(req);
    if (errorsList.isEmpty()) {
      const newblogpost = { ...req.body, createdAt: new Date(), id: uniqid() };

      const blogpostsArray = getblogposts();

      blogpostsArray.push(newblogpost);

      writeblogposts(blogpostsArray);

      res.status(201).send({ id: newblogpost.id });
    } else {
      next(
        createHttpError(400, "Some errors occured in request body!", {
          errorsList,
        })
      );
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/", (req, res, next) => {
  try {
    const blogpostsArray = getblogposts();
    if (req.query && req.query.category) {
      const filteredblogposts = blogpostsArray.filter(
        (blogpost) => blogpost.category === req.query.category
      );
      res.send(filteredblogposts);
    } else {
      res.send(blogpostsArray);
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/:blogpostId", (req, res, next) => {
  try {
    const blogpostId = req.params.blogpostId;
    const blogpostsArray = getblogposts();
    const foundblogpost = blogpostsArray.find(
      (blogpost) => blogpost.id === blogpostId
    );
    if (foundblogpost) {
      res.send(foundblogpost);
    } else {
      next(
        createHttpError(
          404,
          `blogpost with id ${req.params.blogpostId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.put("/:blogpostId", (req, res, next) => {
  try {
    const blogpostId = req.params.blogpostId;
    const blogpostsArray = getblogposts();
    const index = blogpostsArray.findIndex(
      (blogpost) => blogpost.id === blogpostId
    );
    const oldblogpost = blogpostsArray[index];
    const updatedblogpost = {
      ...oldblogpost,
      ...req.body,
      updatedAt: new Date(),
    };
    blogpostsArray[index] = updatedblogpost;
    writeblogposts(blogpostsArray);
    res.send(updatedblogpost);
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.delete("/:blogpostId", (req, res, next) => {
  try {
    const blogpostId = req.params.blogpostId;
    const blogpostsArray = getblogposts();
    const remaningblogposts = blogpostsArray.filter(
      (blogpost) => blogpost.id !== blogpostId
    );
    writeblogposts(remaningblogposts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default blogpostsRouter;
