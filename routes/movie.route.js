const movieControl = require("../controls/movie.control")
const router = require("express").Router()

router.get("/", movieControl.home)
router.post("/addToCollection", movieControl.addToCollection)
router.get("/collection", movieControl.collection)
router.post("/remove", movieControl.remove)
router.post("/more", movieControl.more)

module.exports = router