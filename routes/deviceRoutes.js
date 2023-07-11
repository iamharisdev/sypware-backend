const express = require("express")
const deviceController = require("../controllers/device/deviceController")

const router = express.Router()

router.route("/").put(deviceController.updateDevice)
router.route("/").post(deviceController.createDevicePin)
router.route("/loginWithPin").post(deviceController.loginWithPin)


module.exports = router
