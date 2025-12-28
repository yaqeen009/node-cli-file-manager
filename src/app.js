import { create } from "./commands/create.js";
import { del } from "./commands/delete.js";

const [, , command, ...args] = process.argv;

switch (command) {
  case "create":
    create(args);
    break;
  // case "read":
  //     read()
  // case "update":
  //     update()
  case "delete":
    del(args);
    break;
  // case "list":
  //     list()
  // case "rename":
  //     rename()
  default:
    break;
}
