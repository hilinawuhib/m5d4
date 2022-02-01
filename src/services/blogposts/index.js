import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { newBlogpostValidation } from "./validation.js";

import {
  getBlogposts,
  writeBlogposts,
  getAuthors,
} from "../../lib/fs-tools.js";

const blogpostsRouter = express.Router();

blogpostsRouter.post("/", newBlogpostValidation, async (req, res, next) => {
  try {
    const errorsList = validationResult(req);
    if (errorsList.isEmpty()) {
      const newblogpost = { ...req.body, createdAt: new Date(), id: uniqid() };

      const blogpostsArray = getblogposts();

      blogpostsArray.push(newblogpost);

      await writeBlogposts(blogpostsArray);

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

blogpostsRouter.get("/", async (req, res, next) => {
  try {
    const blogpostsArray = await getBlogposts();
    const authorsArray = await getAuthors();
    if (req.query && req.query.category) {
      const filteredblogposts = blogpostsArray.filter(
        (blogpost) => blogpost.category === req.query.category
      );
      res.send(filteredblogposts);
    } else {
      res.send({ authorsArray, blogpostsArray });
    }
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.get("/:blogpostId", async (req, res, next) => {
  try {
    const blogpostId = req.params.blogpostId;
    const blogpostsArray = await getBlogposts();
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

blogpostsRouter.put("/:blogpostId", async (req, res, next) => {
  try {
    const blogpostId = req.params.blogpostId;
    const blogpostsArray = await getBlogposts();
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
    writeBlogposts(blogpostsArray);
    res.send(updatedblogpost);
  } catch (error) {
    next(error);
  }
});

blogpostsRouter.delete("/:blogpostId", async (req, res, next) => {
  try {
    const blogpostId = req.params.blogpostId;
    const blogpostsArray = await getBlogposts();
    const remaningblogposts = blogpostsArray.filter(
      (blogpost) => blogpost.id !== blogpostId
    );
    await writeBlogposts(remaningblogposts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default blogpostsRouter;
