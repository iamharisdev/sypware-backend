const {promisify} = require("util")
const AppError = require("../../utils/appError")
const catchAsync = require("../../utils/catchAsync")
const prisma = require("../../prisma")

exports.updateDevice = catchAsync(async (req, res, next) => {
 try {
  const {child_id, device_id, data} = req.body
  if (!child_id || !device_id || !data) {
   return next(
    new AppError(
     !device_id
      ? "Device_id is required!"
      : !child_id
      ? "Child_id is required!"
      : "data is required!",
     400
    )
   )
  }

  const check = await prisma.device.findFirst({
   where: {
    id: device_id,
    child_id: child_id,
   },
  })

  if (!check) {
   return next(new AppError("device not found!", 400))
  }

  const device = await prisma.device.update({
   where: {
    id: device_id,
   },
   data: data,
  })

  res.status(200).json({
   status: "success",
   data: device,
  })
 } catch (e) {
  const {message} = e
  return next(new AppError(message, 500))
 }
})

exports.createDevicePin = catchAsync(async (req, res, next) => {
 try {
  const {device_id, status, pin} = req.body
  if (!device_id || !pin || !status)
   return next(
    new AppError(
     !device_id
      ? "Please provide device_id!"
      : !status
      ? "Please provide device status!"
      : "Please provide screen pin!",
     400
    )
   )

  const check = await prisma.screenLock.findUnique({
   where: {
    device_id: device_id,
   },
  })

  if (check) {
   return next(new AppError("Pin already created!", 400))
  }

  const newScreenLockPin = await prisma.screenLock.create({
   data: {
    device_id: device_id,
    status: status,
    pin: pin,
   },
  })
  res.status(200).json({
   status: "success",
   data: newScreenLockPin,
  })
 } catch (e) {
  const {message} = e
  return next(new AppError(message, 500))
 }
})

exports.loginWithPin = catchAsync(async (req, res, next) => {
 try {
  const {pin, device_id} = req?.body

  if (!device_id || !pin) {
   return next(
    new AppError(!device_id ? "Device_id is required!" : "Pin is required", 400)
   )
  }

  const check = await prisma.screenLock.findFirst({
   where: {
    device_id: device_id,
    pin: pin,
   },
   include: {device: true},
  })

  if (!check) {
   return next(new AppError("device not found!", 400))
  }

  res.status(200).json({
   status: "success",
   data: check,
  })
 } catch (e) {
  const {message} = e
  return next(new AppError(message, 500))
 }
})

exports.createCallLogs = catchAsync(async (req, res, next) => {
 try {
  const {callLogArray, device_id} = req?.body

  if (!device_id || !callLogArray) {
   return next(
    new AppError(
     !device_id ? "Device_id is required!" : "Call log array is required",
     400
    )
   )
  }

  const check = await prisma.callLogs.findUnique({
   where: {
    device_id: device_id,
   },
  })

  if (check) {
   return next(
    new AppError(`Record already exist with device_id ${device_id} `, 400)
   )
  }

  const result = await prisma.callLogs.create({
   data: {
    device_id: device_id,
    callLogArray: callLogArray,
   },
  })
  res.status(200).json({
   status: "success",
   data: result,
  })
 } catch (e) {
  const {message} = e
  return next(new AppError(message, 500))
 }
})

exports.updateCallLogs = catchAsync(async (req, res, next) => {
 try {
  const {callLogArray, device_id} = req?.body

  if (!device_id || !callLogArray) {
   return next(
    new AppError(
     !device_id ? "Device_id is required!" : "Call log array is required",
     400
    )
   )
  }

  const check = await prisma.callLogs.findUnique({
   where: {
    device_id: device_id,
   },
  })

  if (!check) {
   return next(new AppError(`Record not found!`, 404))
  }

  const result = await prisma.callLogs.update({
   where: {
    device_id: device_id,
   },
   data: {
    callLogArray: callLogArray,
   },
  })
  res.status(200).json({
   status: "success",
   data: result,
  })
 } catch (e) {
  const {message} = e
  return next(new AppError(message, 500))
 }
})

exports.createMessages = catchAsync(async (req, res, next) => {
 try {
  const {messageArray, device_id} = req?.body

  if (!device_id || !messageArray) {
   return next(
    new AppError(
     !device_id ? "Device_id is required!" : "Message array is required",
     400
    )
   )
  }

  const check = await prisma.messages.findUnique({
   where: {
    device_id: device_id,
   },
  })

  if (check) {
   return next(
    new AppError(`Record already exist with device_id ${device_id} `, 400)
   )
  }

  const result = await prisma.messages.create({
   data: {
    device_id: device_id,
    messageArray: messageArray,
   },
  })
  res.status(200).json({
   status: "success",
   data: result,
  })
 } catch (e) {
  const {message} = e
  return next(new AppError(message, 500))
 }
})

exports.updateMessages = catchAsync(async (req, res, next) => {
 try {
  const {device_id, messageArray} = req?.body

  if (!device_id || !messageArray) {
   return next(
    new AppError(
     !device_id ? "Device_id is required!" : "Message array is required",
     400
    )
   )
  }

  const check = await prisma.messages.findUnique({
   where: {
    device_id: device_id,
   },
  })

  if (!check) {
   return next(new AppError("Record not found!", 404))
  }

  const result = await prisma.messages.update({
   where: {
    device_id: device_id,
   },
   data: {
    messageArray: messageArray,
   },
  })

  res.status(200).json({
   status: "success",
   data: result,
  })
 } catch (e) {
  const {message} = e
  return next(new AppError(message, 500))
 }
})
