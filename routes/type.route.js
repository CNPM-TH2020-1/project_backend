const typeControl = require("../controls/type.control")
const router = require("express").Router()

router.get("/getAllType", typeControl.getAllType)
router.post("/create",typeControl.createType)
router.patch("/update",typeControl.updateType)
router.patch("/updateMinDeposit",typeControl.updateMinDeposit)

module.exports = router