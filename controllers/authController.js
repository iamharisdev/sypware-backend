const {promisify} = require("util")
const jwt = require("jsonwebtoken")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const prisma = require("../prisma")
const bcrypt = require("bcrypt")

const signToken = (id) => {
 return jwt.sign({id}, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
 })
}

async function comparePassword(password, hashedPassword) {
 return await bcrypt.compare(password, hashedPassword)
}

const createSendToken = async (user, statusCode, res) => {
 const token = signToken(user._id)
 const cookieOptions = {
  expires: new Date(
   Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
 }
 console.log("[cookieOptions]", cookieOptions)
 if (process.env.NODE_ENV === "production") cookieOptions.secure = true
 res.cookie("jwt", token, cookieOptions)
 // Remove password from output
 user.password = undefined
 res.status(statusCode).json({
  status: "success",
  token,
  data: {
   user,
  },
 })
}

exports.signUp = catchAsync(async (req, res, next) => {
 const {fullname, email, password, confirm_password, phone_number, address} =
  req.body

 if (password !== confirm_password)
  return next(new AppError("Password and confirm Password do not match!", 400))

 // Hash the password
 const hashedPassword = await bcrypt.hash(password, 10)

 const newUser = await prisma.user.create({
  data: {
   fullname: fullname,
   email: email,
   password: hashedPassword,
   phone_number: phone_number,
   address: address,
  },
 })

 createSendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
 const {email, password} = req.body

 if (!email || !password) {
  return next(new AppError("Please provide email and password!", 400))
 }

 const user = await prisma.user.findUnique({
  where: {
   email: email,
  },
 })

 console.log("[user]", user)

 if (!user || !(await comparePassword(password, user.password))) {
  return next(new AppError("Incorrect email or password", 401))
 }

 createSendToken(user, 200, res)
})

exports.logout = (req, res) => {
 res.cookie("jwt", "loggedout", {
  expires: new Date(Date.now() + 10 * 1000),
  httpOnly: true,
 })
 res.status(200).json({status: "success", message: "Logged out"})
}

exports.protect = catchAsync(async (req, res, next) => {
 // 1) Getting token and check of it's there
 let token
 if (
  req.headers.authorization &&
  req.headers.authorization.startsWith("Bearer")
 ) {
  token = req.headers.authorization.split(" ")[1]
 }

 if (!token) {
  return next(
   new AppError("You are not logged in! Please log in to get access.", 401)
  )
 }
})
