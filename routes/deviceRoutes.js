const express = require("express")
const deviceController = require("../controllers/device/deviceController")

const router = express.Router()

router.route("/").put(deviceController.updateDevice)
router.route("/").post(deviceController.createDevicePin)
router.route("/loginWithPin").post(deviceController.loginWithPin)
router.route('/callLogs').post(deviceController.createCallLogs)
router.route('/callLogs').put(deviceController.updateCallLogs)
router.route('/messages').post(deviceController.createMessages)
router.route('/messages').put(deviceController.updateMessages)


module.exports = router
