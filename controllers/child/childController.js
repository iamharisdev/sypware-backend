const {promisify} = require("util")
const AppError = require("../../utils/appError")
const catchAsync = require("../../utils/catchAsync")
const prisma = require("../../prisma")

exports.createChild = catchAsync(async (req, res, next) => {
 const {name, phone_number, parent_id} = req.body

 if (!name || !phone_number)
  return next(
   new AppError("Pleaes provide both name and phone number of child!", 400)
  )

 if (!parent_id) {
  return next(
   new AppError("Pleaes provide parent id. Currently it is missing!", 400)
  )
 }

 const newChild = await prisma.child.create({
  data: {
   name,
   phone_number,
   parent_id,
  },
 })
 res.status(200).json({
  status: "success",
  data: {
   child: newChild,
  },
 })
})

exports.getAll = catchAsync(async (req, res, next) => {
 const childs = await prisma.child.findMany()
 res.status(200).json({
  status: "success",
  data: {
   childs: childs,
  },
 })
})

// exports.getChildsByParent = catchAsync(async (req, res, next) => {
//  const {id} = req.params
//  const childs = await prisma.child.findMany()
//  res.status(200).json({
//   status: "success",
//   data: {
//    childs: childs,
//   },
//  })
// })
