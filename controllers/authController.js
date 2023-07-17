const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const prisma = require('../prisma');
const bcrypt = require('bcrypt');
const { AddMinutesToDate, dates } = require('../utils/exports');
const { encode, decode } = require('../middlewares/crypt');
const SendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

const createSendToken = async (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  // Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const {
    fullname,
    email,
    password,
    confirm_password,
    phone_number,
    address,
    role,
  } = req.body;

  if (password !== confirm_password)
    return next(
      new AppError('Password and confirm Password do not match!', 400),
    );

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Check email in db if email already exists
  const alreadyExists = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (alreadyExists) {
    return next(
      new AppError('Email already exists. Please choose a different one', 400),
    );
  }

  const newUser = await prisma.user.create({
    data: {
      fullname: fullname,
      email: email,
      password: hashedPassword,
      phone_number: phone_number,
      address: address,
      role,
    },
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user || !(await comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError('Email is required!', 400));
    }

    const check = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!check) {
      return next(new AppError('Email is not found!', 404));
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 10);

    //Create OTP instance in DB
    const otp_instance = await prisma.otp.create({
      data: {
        otp: otp,
        expiration_time: new Date(expiration_time),
      },
    });

    // Create details object containing the email and otp id
    var details = {
      timestamp: now,
      check: email,
      success: true,
      message: 'OTP sent to user',
      otp_id: otp_instance?.id,
    };

    // Encrypt the details object
    let encoded = await encode(JSON.stringify(details));

    var mailOptions = {
      to: email,
      subject: 'Sending Email using Node.js for reset password',
      text: `Your OTP code is ${otp}`,
    };

    await SendEmail(mailOptions, encoded, otp, res);
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 401));
  }
});

exports.verifyOtp = catchAsync(async (req, res, next) => {
  try {
    var currentdate = new Date();
    const { verification_key, otp, email } = req?.body;

    if (!email || !verification_key || !otp) {
      return next(
        new AppError(
          !email
            ? 'Email is required!'
            : !verification_key
            ? 'Verification_key is required!'
            : 'OTP is required!',
          400,
        ),
      );
    }

    let decoded = await decode(verification_key);
    var obj = JSON.parse(decoded);

    // Check if the OTP was meant for the same email or phone number for which it is being verified
    if (email != obj?.check) {
      return next(new AppError('Email is Incorrect!', 400));
    }

    const otp_instance = await prisma.Otp.findFirst({
      where: { id: obj.otp_id },
    });

    //  //Check if OTP is available in the DB
    if (otp_instance != null) {
      //Check if OTP is already used or not
      if (otp_instance.verified != true) {
        // //Check if OTP is expired or not
        if (dates.compare(otp_instance.expiration_time, currentdate) == 1) {
          //Check if OTP is equal to the OTP in the DB
          if (otp === otp_instance.otp) {
            // Mark OTP as verified or used
            await prisma.Otp.update({
              where: {
                id: obj.otp_id,
              },
              data: {
                verified: true,
              },
            });
            const response = {
              Status: 200,
              Details: 'OTP Matched',
              Check: email,
            };
            return res.status(200).send(response);
          } else {
            const response = { Status: 'Failure', Details: 'OTP NOT Matched' };
            return res.status(400).send(response);
          }
        } else {
          const response = { Status: 'Failure', Details: 'OTP Expired' };
          return res.status(400).send(response);
        }
      } else {
        const response = { Status: 'Failure', Details: 'OTP Already Used' };
        return res.status(400).send(response);
      }
    } else {
      const response = { Status: 'Failure', Details: 'Bad Request' };
      return res.status(400).send(response);
    }
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 400));
  }
});

exports.changePassword = catchAsync(async (req, res, next) => {
  try {
    const { email, password, otp } = req?.body;

    if (!email || !password || !otp) {
      return next(
        new AppError(
          !email
            ? 'Email is required!'
            : !password
            ? 'Password is required!'
            : 'OTP is required!',
          401,
        ),
      );
    }

    const check = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!check) {
      return next(new AppError('User not found!', 404));
    }

    const check_otp_verified = await prisma.otp.findFirst({
      where: {
        otp: otp,
      },
    });

    if (!check_otp_verified) {
      return next(new AppError('Enter correct OTP!', 400));
    }
    if (!check_otp_verified?.verified) {
      return next(new AppError('OTP is not verified!', 400));
    }

    //Delete OTP record after verified
    await prisma.otp.delete({
      where: {
        id: check_otp_verified?.id,
      },
    });

    const result = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: password,
      },
    });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500));
  }
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', message: 'Logged out' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }
});
