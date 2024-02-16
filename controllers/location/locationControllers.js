const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const prisma = require('../../prisma');

exports.createRequest = catchAsync(async (req, res, next) => {
  try {
    const { lat, lang, device_id } = req?.body;

    if (!lat || !lang || !device_id) {
      return next(
        new AppError(
          !lat
            ? 'Latitude is required!'
            : !lang
            ? 'Longitude is required!'
            : 'Device id is required',
          400,
          res,
        ),
      );
    }

    const check = await prisma.device.findFirst({
      where: { id: device_id },
    });

    if (!check) {
      return next(new AppError('Device not found!', 400, res));
    }

    const result = await prisma.location.create({
      data: {
        latitude: lat,
        longitude: lang,
        device: {
          connect: { id: device_id },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    const { message, statusCode } = error;
    console.log('statusCode:=>  ', error);
    return next(new AppError(message, statusCode, res));
  }
});
