import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
const authorsRouter = express.Router();

const currentFilePath = fileURLToPath(import.meta.url);

const parentFolderPath = dirname(currentFilePath);

const authorsJSONPath = join(parentFolderPath, "authors.json");

authorsRouter.post("/", (req, res) => {
  console.log("REQUEST BODY: ", req.body);

  const newauthor = { ...req.body, createdAt: new Date(), id: uniqid() };

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  authorsArray.push(newauthor);

  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

  res.status(201).send({ id: newauthor.id });
});

authorsRouter.get("/", (req, res) => {
  const fileContent = fs.readFileSync(authorsJSONPath);
  console.log("FILE CONTENT: ", JSON.parse(fileContent));

  const authorsArray = JSON.parse(fileContent) / res.send(authorsArray);
});

authorsRouter.get("/:authorId", (req, res) => {
  console.log("ID: ", req.params.authorId);

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const foundauthor = authorsArray.find(
    (author) => author.id === req.params.authorId
  );

  res.send(foundauthor);
});

authorsRouter.put("/:authorId", (req, res) => {
  res.send({ message: " I am the PUT endpoint" });

  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const index = authorsArray.findIndex(
    (author) => author.id === req.params.authorId
  );
  const oldauthor = authorsArray[index];
  const updatedauthor = { ...oldauthor, ...req.body, updatedAt: new Date() };
  authorsArray[index] = updatedauthor;

  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

  res.send(updatedauthor);
});

authorsRouter.delete("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const remainingauthors = authorsArray.filter(
    (author) => author.id !== req.params.authorId
  );

  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingauthors));

  res.status(204).send();
});
export default authorsRouter;
