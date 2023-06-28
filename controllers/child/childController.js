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

exports.updateChild = catchAsync(async (req, res, next) => {
 const {id, name, phone_number, parent_id} = req.body

 // Check if the child with the specified ID exists
 const existingChild = await prisma.child.findUnique({
  where: {
   id: id,
  },
 })

 if (!existingChild) {
  return next(new AppError("Child not found!", 400))
 }

 // Check if the parent with the specified ID exists
 const existingParent = await prisma.user.findUnique({
  where: {
   id: parent_id,
  },
 })

 if (!existingParent) {
  return next(new AppError("Parent not found!", 400))
 }

 const updatedChild = await prisma.child.update({
  where: {
   id: id,
  },
  data: {
   name: name,
   phone_number: phone_number,
   parent_id: parent_id,
  },
 })

 res.status(200).json({
  status: "success",
  data: {
   child: updatedChild,
  },
 })
})

exports.deleteChild = catchAsync(async (req, res, next) => {
 const {id} = req.body

 const existingChild = await prisma.child.findUnique({
  where: {
   id: parseInt(id),
  },
 })

 if (!existingChild) {
  return next(new AppError("Child not found!", 400))
 }

 await prisma.child.delete({
  where: {
   id: parseInt(id),
  },
 })

 res.status(200).json({
  status: "success",
  message: "Child deleted successfully.",
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

exports.getChildsByParent = catchAsync(async (req, res, next) => {
 const {id} = req.params
 console.log("[getChildsByParent id]", id)
 const children = await prisma.child.findMany({
  where: {
   parent_id: Number(id),
  },
  include: {
   Child: true,
  },
 })
 console.log("[children]", children)
 if (!children.length) {
  return next(new AppError("Parent not found or no children associated", 404))
 }
 res.status(200).json({
  status: "success",
  data: {
   children,
  },
 })
})
