const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const prisma = require('../../prisma');

exports.createAppUsages = catchAsync(async (req, res, next) => {
  try {
    const { appUsageArray, device_id } = req?.body;

    if (!device_id || !appUsageArray) {
      return next(
        new AppError(
          !device_id ? 'Device_id is required!' : 'AppUsage array is required',
          400,
          res,
        ),
      );
    }

    const check = await prisma.device.findUnique({
      where: { id: device_id },
    });

    if (!check) {
      return next(new AppError('Device id is not found!', 404, res));
    }

    const result = await prisma.appUsages.create({
      data: {
        apps: appUsageArray,
        device_id: device_id,
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
