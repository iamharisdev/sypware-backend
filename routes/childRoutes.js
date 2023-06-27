const express = require("express")
const childController = require("../controllers/child/childController")

const router = express.Router()

router.route("/").post(childController.createChild)
router.route("/").get(childController.getAll)
router.route("/:id").get(childController.getChildsByParent)

module.exports = router
