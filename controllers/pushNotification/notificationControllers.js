const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const prisma = require('../../prisma');
const { messaging } = require('../../config/firebaseConfig');

exports.pushNotification = catchAsync(async (req, res, next) => {
  try {
    const { id } = req?.user;

    const { title, boby } = req?.body;

    if (!title) {
      return next(new AppError('Title is required!', 400, res));
    }

    const result = await prisma.user.findFirst({
      where: { id },
      include: { fcmToken: true },
    });

    const tokens = result?.fcmToken;

    if (!result) {
      return next(new AppError('Parent not found!', 404, res));
    }
    if (tokens.length == 0) {
      return next(
        new AppError('No FcmToken found against this parent!', 404, res),
      );
    }

    const message = {
      notification: {
        title: title || 'Unkown',
        body: boby || 'This is the testing message',
      },
      tokens: tokens,
    };

    messaging
      .sendEachForMulticast(message)
      .then((response) => {
        console.log(response.successCount + ' messages were sent successfully');
        // Handle any failed messages if needed
        if (response.failureCount > 0) {
          const failedTokens = [];
          response.responses.forEach((resp, index) => {
            if (!resp.success) {
              failedTokens.push(tokens[index]);
            }
          });
          console.log(
            'List of tokens that failed to receive the notification:',
            failedTokens,
          );
        }
      })
      .catch((error) => {
        const { message, statusCode } = error;
        return next(new AppError(message, statusCode, res));
      });
  } catch (e) {
    const { message, statusCode } = e;
    return next(new AppError(message, statusCode, res));
  }
});

exports.deviceToken = catchAsync(async (req, res, next) => {
  try {
    const { id } = req?.user;
    const { device_Token } = req?.body;

    if (!device_Token) {
      return next(new AppError('Device token is required!', 400, res));
    }

    const check = await prisma.user.findFirst({
      where: { id: id },
    });
    if (!check) {
      return next(new AppError('Parent is not found!', 404, res));
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
    return next(new AppError(message, statusCode, res));
  }
});
