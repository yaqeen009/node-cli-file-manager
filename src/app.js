import { create } from "./commands/create.js"

const [,,command, ...args] = process.argv

switch (command) {
    case "create":
            create(args)
        // case "read":
        //     read()
        // case "update":
        //     update()
        // case "delete":
        //     del()
        // case "list":
        //     list()
        // case "rename":
        //     rename()
        default:
            break
}