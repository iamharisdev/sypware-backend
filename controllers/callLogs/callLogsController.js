const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const prisma = require('../../prisma');

exports.createCallLogs = catchAsync(async (req, res, next) => {
  try {
    const { callLogArray, device_id } = req?.body;

    if (!device_id || !callLogArray) {
      return next(
        new AppError(
          !device_id ? 'Device_id is required!' : 'Call log array is required',
          400,
          res,
        ),
      );
    }

    const check = await prisma.device.findFirst({
      where: {
        id: device_id,
      },
      include: { callLogs: true },
    });

    if (!check) {
      return next(new AppError('Device not found!', 404, res));
    }

    if (check.callLogs.length != 0) {
      const resultUpdate = await prisma.callLogs.update({
        where: {
          device_id: device_id,
        },
        data: {
          callLogArray: callLogArray,
        },
      });
      res.status(200).json({
        status: 'success',
        data: resultUpdate,
      });
      return null;
    }

    const result = await prisma.callLogs.create({
      data: {
        callLogArray,
        device: {
          connect: { id: device_id },
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

exports.updateCallLogs = catchAsync(async (req, res, next) => {
  try {
    const { callLogArray, device_id } = req?.body;

    if (!device_id || !callLogArray) {
      return next(
        new AppError(
          !device_id ? 'Device_id is required!' : 'Call log array is required',
          400,
          res,
        ),
      );
    }

    const device = await prisma.device.findFirst({
      where: { id: device_id },
      include: { callLogs: true },
    });

    if (!device) {
      return next(new AppError('Device not found!', 404, res));
    }

    if (!device.callLogs || device.callLogs.length === 0) {
      return next(new AppError(`No call logs found for the device!`, 404, res));
    }

    const result = await prisma.callLogs.update({
      where: {
        device_id: device_id,
      },
      data: {
        callLogArray: callLogArray,
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

exports.getCallLogsByDeviceId = catchAsync(async (req, res, next) => {
  try {
    const device_id = parseInt(req.params.device_id);
    if (!device_id) {
      return next(new AppError('Device_id is required!', 400, res));
    }

    const result = await prisma.device.findFirst({
      where: {
        id: device_id,
      },
      include: { callLogs: true },
    });

    if (!result) {
      return next(new AppError('Record not found!', 404, res));
    }

    res.status(200).json({
      status: 'success',
      data: result?.callLogs,
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});
