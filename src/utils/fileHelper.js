//all helper functions go here

import { writeFile, mkdir } from "fs/promises";
import path from "path";

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