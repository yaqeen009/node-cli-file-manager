import { pathFile, rootFile } from "../utils/fileHelper.js";

export const create = async (args) => {
  const [createType, target, content] = args;

  switch (createType) {
    case "path":
      pathFile(target, content);
      break;
    case "file":
      rootFile(target, content);
      break;
    default:
      console.error(
        "Usage:\n " +
          "create <fileName> <content> \n" +
          "create <path/to/file> <content>"
      );
      break;
  }
  /*
  --> add more variations like file types(json, js, py...)
  --> handle errors well
  --> condense cli commands
  */
};
