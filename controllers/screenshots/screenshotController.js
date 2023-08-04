const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const prisma = require('../../prisma');

exports.createScreenShots = catchAsync(async (req, res, next) => {
  try {
    const { device_id } = req?.body;
    let id = parseInt(device_id);

    const { path } = req?.file;
    if (!device_id) {
      return next(new AppError('Device_id is required!'));
    }

    const check = await prisma.device.findUnique({
      where: {
        id,
      },
    });
    if (!check) {
      return next(new AppError('Device id not exist!', 404, res));
    }

    const result = await prisma.screenShots.create({
      data: {
        screenShot: path,
        device: {
          connect: { id },
        },
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

exports.getAllScreenShots = catchAsync(async (req, res, next) => {
  try {
    const { device_id } = req?.params;
    let id = parseInt(device_id);

    if (!id) {
      return next(new AppError('Device id is required!', 400, res));
    }
    const check = await prisma.device.findUnique({
      where: { id },
      include: { screenShots: true },
    });

    if (!check) {
      return next(new AppError('Device  not found!', 404, res));
    }

    if (check.screenShots.length == 0) {
      return next(
        new AppError('Screenshots not found against this device_id!', 404, res),
      );
    }
    res.status(200).json({
      status: 'success',
      data: check.screenShots,
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});

exports.deleteScreenShots = catchAsync(async (req, res, next) => {
  try {
    const { ids, device_id } = req.body;

    if (!ids || !device_id) {
      return next(
        new AppError(
          !ids ? 'Screenshot ids is required!' : 'Device id is required!',
        ),
      );
    }

    const parsedIds = JSON.parse(ids);
    const device = parseInt(device_id);

    const check = await prisma.device.findMany({
      where: { id: device },
      include: { screenShots: true },
    });

    if (!check) {
      return next(new AppError('Device is not found!', 404, res));
    }

    const existingIds = await prisma.screenShots.findMany({
      where: {
        id: {
          in: parsedIds,
        },
      },
      select: {
        id: true,
      },
    });

    // Convert the array of fetched IDs into a Set for faster comparison
    const existingIdSet = new Set(existingIds.map((item) => item.id));

    // Check if all the IDs in the idArray exist in the database
    const allIdsExistInDatabase = parsedIds.every((id) =>
      existingIdSet.has(id),
    );

    if (!allIdsExistInDatabase) {
      return next(
        new AppError('Some Screenshots id is not present!', 404, res),
      );
    }

    const check2 = await prisma.screenShots.findFirst({
      where: {
        device_id: device,
      },
    });

    if (!check2) {
      return next(
        new AppError('No screenshot is present with device id!', 404, res),
      );
    }

    const deleteResult = await prisma.screenShots.deleteMany({
      where: {
        id: { in: parsedIds },
        device_id: {
          equals: device,
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: deleteResult,
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});
