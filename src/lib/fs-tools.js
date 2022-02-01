import fs from "fs-extra" // 3rd party module
import { fileURLToPath } from "url"
import { join, dirname } from "path"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const usersPublicFolderPath = join(process.cwd(), "./public/img/users")

const blogpostsJSONPath = join(dataFolderPath, "blogposts.json")
const authorsJSONPath = join(dataFolderPath, "authors.json")

export const getBlogposts = () => readJSON(booksJSONPath)
export const writeBlogposts = content => writeJSON(booksJSONPath, content)
export const getAuthors = () => readJSON(usersJSONPath)
export const writeAuthors = content => writeJSON(usersJSONPath, content)

export const saveUsersAvatars = (filename, contentAsABuffer) => writeFile(join(usersPublicFolderPath, filename), contentAsABuffer)
