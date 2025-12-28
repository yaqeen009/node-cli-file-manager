//delete one file
//delete multiple files
import { delSingle, delDir, delMul } from "../utils/fileHelper.js";

export const del = async (args) => {
  const [delType, ...target] = args;

  switch (delType) {
    case "single":
      delSingle(target);
      break;
    case "dir":
      delDir(target);
      break;
    case "multiple":
      delMul(target);
      break;
    default:
      console.error(
        "Usage:\n" +
          "Use 'single' & <filePath> to delete a single file \n" +
          "Use 'dir' & <directory> to delete a directory \n" +
          "Use 'multiple' & <paths to dirs/files> to delete multiple dirs or files"
      );

      break;
  }

  /*
  --> add more variations like deleting specific file types(json, js, py...)
  --> handle errors well
  --> condense cli commands
  */
};
