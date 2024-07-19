import cron from "node-cron"
import { LogZip } from "./log.js"
import { execSync } from "child_process"


cron.schedule("0 0 * * *" , async () => {
    await LogZip()
})

cron.schedule("0 * * * *" , () => {
    execSync("npm run remove")
})