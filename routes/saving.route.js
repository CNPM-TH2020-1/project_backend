const savingControl = require("../controls/saving.control")
const router = require("express").Router()

router.get("/", savingControl.getSavingByCCCD)
router.post("/create", savingControl.create)
router.get("/savingdetail", savingControl.getById)
router.patch("/deposit", savingControl.UserDeposit)
router.patch("/withdraw", savingControl.UserWithdraw)

module.exports = router