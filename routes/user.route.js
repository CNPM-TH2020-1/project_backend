const userControl = require("../controls/user.control");
var router = require("express").Router();
const auth = require("../middlewares/authorization")

router.get("/signup", auth.checkAuthorized, userControl.signup);
router.post("/create", auth.checkAuthorized, userControl.create)
router.get("/login", auth.checkAuthorized, userControl.login);
router.post("/authenticate", auth.checkAuthorized, userControl.authenticate)
router.get("/logout", userControl.logout)

module.exports = router