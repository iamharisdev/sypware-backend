const {promisify} = require("util")
const AppError = require("../../utils/appError")
const catchAsync = require("../../utils/catchAsync")
const prisma = require("../../prisma")

 

exports.updateDevice=catchAsync(async(req,res,next)=>{
const {child_id,device_id,data} = req.body

 const check = await prisma.device.findFirst({
    where:{
      id:device_id,
      child_id:child_id
   },
 })

 if (!check) {
  return next(new AppError("device not found!", 400))
 }

 const device = await prisma.device.update({
    where:{
      id:device_id,
   },
   data:data
 })

 res.status(200).json({
  status: "success",
  data: device
 })

})



exports.createDevicePin=catchAsync(async(req,res,next)=>{
const {device_id,status,pin} = req.body
try{


 if (!device_id||!pin||!status)
  return  next(
   new AppError(!device_id?"Please provide device_id!":!status?"Please provide device status!":"Please provide screen pin!" , 400)
  )


 const newScreenLockPin = await prisma.screenLock.create({
   data:{
      device_id:device_id,
      status:status,
      pin:pin
   }
 })
 res.status(200).json({
  status: "success",
  data: newScreenLockPin
 })

}
catch(e){
   const {message} = e
    return next(new AppError(message, 500))
}

})

exports.loginWithPin=catchAsync(async(req,res,next)=>{
   const {pin,device_id} = req?.body
   const check = await prisma.screenLock.findFirst({
      where:{
         device_id:device_id,
         pin:pin
      },
      include:{device:true}
   })

if (!check) {
  return next(new AppError("device not found!", 400))
 }

res.status(200).json({
  status: "success",
  data: check
 })
})


