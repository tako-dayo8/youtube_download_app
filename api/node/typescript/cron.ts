import cron from "node-cron"
import log, { LogZip } from "./log.js"
import runFileRemove from "./fileRemove.js"


cron.schedule("0 0 * * *" , async () => {
    log.Tarminal("INFO" , "--- LogZip Start ---")
    await LogZip()
    log.Tarminal("INFO" , "--- LogZip End ---")
})

cron.schedule("0 * * * *" , () => {
    log.Tarminal("INFO" , "--- file remove Start ---")
    runFileRemove()
    log.Tarminal("INFO" , "--- file remove End ---")
})

// test
// cron.schedule("0 * * * * *", () => {
//     console.log("Cron job running every minute");   
// })


log.Tarminal("INFO" , "Cron Active")
