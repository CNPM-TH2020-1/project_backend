const typeControl = require("../controls/type.control")
const router = require("express").Router()

router.get("/getAllType", typeControl.getAllType)

module.exports = router