//all helper functions go here

import { stat, rm, unlink, writeFile, mkdir, access } from "fs/promises";
import path from "path";

//file creator helpers
export const pathFile = async (filePath, fileContent) => {
  if (!filePath || !fileContent) {
    console.error("Usage: Enter <path/to/file> & <'content'>");
  }
  try {
    const resolvedPath = path.resolve(filePath);

    const dir = path.dirname(resolvedPath);
    await mkdir(dir, { recursive: true });

    await writeFile(resolvedPath, fileContent, "utf-8");
    console.log("File created succesfully!");
  } catch (error) {
    console.log("Error creating file: ", error);
  }
};
export const rootFile = async (fileName, fileContent) => {
  if (!fileName || !fileContent) {
    console.error("Usage: Enter <file name with extension> & <'content'>");
  }
  try {
    await writeFile(fileName, fileContent, "utf-8");
    console.log("File created succesfully!");
  } catch (error) {
    console.log("Error creating file: ", error);
  }
};

//file deleter helpers
export const delSingle = async (filePath) => {
  try {
    await access(filePath);

    await unlink(filePath);
    console.log(filePath + ": deleted successfully");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("File does not exist");
    }
    console.error(error);
  }
};

export const delDir = async (dirPath) => {
  try {
    const stats = await stat(dirPath);
    if (!stats.isDirectory()) {
      console.error("Path is not a directory, enter a valid dir dirPath");
      return;
    }
    await rm(dirPath, { recursive: true, force: true });
  } catch (error) {
    console.error(error.message);
  }
};

export const delMul = async (paths = []) => {
  for (const path of paths) {
    try {
      const stats = await stat(path);

      if (stats.isFile()) {
        await unlink(path);
      } else if (stats.isDirectory()) {
        await rm(path, { recursive: true, force: true });
      }
    } catch (error) {
      console.error(error);
    }
  }
  // console.log("Items deleted successfully");
};


//download helper
export const urlValidator = async (string) => {
  try {
    const url = new URL(string)
    return url.protocol === "http" || url.protocol === "https"
  } catch (error) {
    return false
  }
}