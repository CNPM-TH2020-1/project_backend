const savingControl = require("../controls/saving.control")
const router = require("express").Router()

router.get("/", savingControl.getSavingByCCCD)
router.post("/create", savingControl.create)
router.get("/savingdetail", savingControl.getById)
router.patch("/deposit", savingControl.UserDeposit)
router.patch("/withdraw", savingControl.UserWithdraw)
router.get("/reportbyMonth", savingControl.MonthlyReport)
router.get("/reportbyDay", savingControl.DailyReport)
router.get("/getAll", savingControl.getAllSaving)

module.exports = router