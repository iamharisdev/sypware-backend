const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const prisma = require('../prisma');
const bcrypt = require('bcrypt');
const {
  AddMinutesToDate,
  dates,
  createSendToken,
  comparePassword,
} = require('../utils/exports');
const { encode, decode } = require('../middlewares/crypt');
const SendEmail = require('../utils/email');

exports.signUp = catchAsync(async (req, res, next) => {
  try {
    const { fullname, email, password, phone_number, address, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Check email in db if email already exists
    const alreadyExists = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (alreadyExists) {
      return next(
        new AppError(
          'Email already exists. Please choose a different one',
          400,
          res,
        ),
      );
    }

    const newUser = await prisma.user.create({
      data: {
        fullname,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone_number,
        address,
        role,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        newUser,
      },
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password, device_uuid, platform } = req.body;
  var device;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400, res));
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (platform == 'mobile') {
    device = await prisma.device.findFirst({
      where: { device_uuid },
    });
  }

  if (!user || !(await comparePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401, res));
  }

  const obj = await createSendToken(user);
  res.cookie('jwt', obj.token, obj.cookieOptions);

  res.status(200).json({
    status: 'success',
    token: obj.token,
    data: {
      user,
      device: platform == 'mobile' ? device : null,
    },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError('Email is required!', 400, res));
    }

    const check = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!check) {
      return next(new AppError('Email is not found!', 404, res));
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
    return next(new AppError(message, 500, res));
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
          res,
        ),
      );
    }

    let decoded = await decode(verification_key);
    var obj = JSON.parse(decoded);

    // Check if the OTP was meant for the same email or phone number for which it is being verified
    if (email != obj?.check) {
      return next(new AppError('Email is Incorrect!', 400, res));
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
              status: 'success',
              message: 'OTP Matched',
              email: email,
            };
            return res.status(200).send(response);
          } else {
            const response = { status: 'failure', message: 'OTP Not Matched' };
            return res.status(400, res).send(response);
          }
        } else {
          const response = { status: 'failure', message: 'OTP Expired' };
          return res.status(400, res).send(response);
        }
      } else {
        const response = { status: 'failure', message: 'OTP Already Used' };
        return res.status(400, res).send(response);
      }
    } else {
      const response = { status: 'failure', message: 'Bad Request' };
      return res.status(400, res).send(response);
    }
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  try {
    const { email, password, otp } = req?.body;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!otp) {
      return next(new AppError('OTP is required!', 400, res));
    }

    if (!email || !password) {
      return next(
        new AppError(
          !email ? 'Email is required!' : 'Password is required!',
          401,
          res,
        ),
      );
    }

    const check = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!check) {
      return next(new AppError('User not found!', 404, res));
    }

    const check_otp_verified = await prisma.otp.findFirst({
      where: {
        otp: otp,
      },
    });

    if (!check_otp_verified) {
      return next(new AppError('Enter correct OTP!', 400, res));
    }
    if (!check_otp_verified?.verified) {
      return next(new AppError('OTP is not verified!', 400, res));
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
        password: hashedPassword,
      },
    });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});

exports.changePassword = catchAsync(async (req, res, next) => {
  try {
    const { currentPassword, password } = req?.body;
    const { id } = req?.user;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!password || !currentPassword) {
      return next(
        new AppError(
          !password ? 'Password is required!' : 'Current Password is required!',
          401,
          res,
        ),
      );
    }

    const check = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!check) {
      return next(new AppError('User not found!', 404, res));
    }

    if (!(await comparePassword(currentPassword, check.password))) {
      return next(new AppError('Current Password is not matched', 401, res));
    }

    const result = await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});

exports.updateUser = catchAsync(async (req, res, next) => {
  try {
    const { fullname, email, phone_number, address, role } = req.body;

    const { id } = req?.user;
    let obj;
    if (req?.file) {
      const { path } = req?.file;
      obj = {
        fullname,
        email: email.toLowerCase(),
        phone_number,
        address,
        image: path,
        role,
      };
    } else {
      obj = {
        fullname,
        email: email.toLowerCase(),
        phone_number,
        address,
        role,
      };
    }

    const result = await prisma.user.update({
      where: {
        id,
      },
      data: obj,
    });

    res.status(200).json({
      status: 'success',
      data: {
        result,
      },
    });
  } catch (e) {
    const { message, statusCode } = e;
    return next(new AppError(message, 500, res));
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
      new AppError(
        'You are not logged in! Please log in to get access.',
        401,
        res,
      ),
    );
  }
});
