const { promisify } = require('util');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const prisma = require('../../prisma');
const { messaging } = require('../../config/firebaseConfig');

exports.pushNotification = catchAsync(async (req, res, next) => {
  try {
    const { id } = req?.user;

    const { title, boby, parent_id } = req?.body;

    if (!parent_id || !title) {
      return next(
        new AppError(
          !parent_id ? 'Parent id is required!' : 'Title is required!',
          400,
        ),
      );
    }

    const message = {
      notification: {
        title: title || 'Unkown',
        body: boby || 'This is the testing message',
      },
      token: device_token,
    };
    messaging
      .send(message)
      .then((response) => {
        res.status(200).json({
          status: 'success',
          data: response,
        });
      })
      .catch((error) => {
        const { message, statusCode } = error;
        return next(new AppError(message, statusCode));
      });
  } catch (e) {
    const { message, statusCode } = e;
    return next(new AppError(message, statusCode));
  }
});

exports.deviceToken = catchAsync(async (req, res, next) => {
  try {
    const { id } = req?.user;
    const { device_Token } = req?.body;

    if (!device_Token) {
      return next(new AppError('Device token is required!', 400));
    }

    const check = await prisma.user.findFirst({
      where: { id: id },
    });
    if (!check) {
      return next(new AppError('Parent is not found!', 404));
    }

    const result = await prisma.fcmToken.create({
      data: {
        device_Token,
        user: {
          connect: { id: id },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (e) {
    const { message, statusCode } = e;
    return next(new AppError(message, statusCode));
  }
});
