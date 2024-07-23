import cron from "node-cron"
import log, { LogZip } from "./log.js"
import { execSync } from "child_process"


cron.schedule("0 0 * * *" , async () => {
    log.Tarminal("INFO" , "--- LogZip Start ---")
    await LogZip()
    log.Tarminal("INFO" , "--- LogZip End ---")
})

cron.schedule("0 * * * *" , () => {
    log.Tarminal("INFO" , "--- file remove Start ---")
    execSync("npm run remove")
    log.Tarminal("INFO" , "--- file remove End ---")
})

// test
// cron.schedule("0 * * * * *", () => {
//     console.log("Cron job running every minute");   
// })


log.Tarminal("INFO" , "Cron Active")
