const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const prisma = require('../../prisma');

exports.createMessages = catchAsync(async (req, res, next) => {
  try {
    const { messageArray, device_id } = req?.body;

    if (!device_id || !messageArray) {
      return next(
        new AppError(
          !device_id ? 'Device_id is required!' : 'Message array is required',
          400,
          res,
        ),
      );
    }

    const device = await prisma.device.findUnique({
      where: {
        id: device_id,
      },
    });

    if (!device) {
      return next(new AppError('Device not found!', 404, res));
    }

    const check = await prisma.messages.findUnique({
      where: {
        device_id: device_id,
      },
    });

    if (!check) {
      const result = await prisma.messages.create({
        data: {
          device_id: device_id,
          messageArray: messageArray,
        },
      });
      res.status(200).json({
        status: 'success',
        data: result,
      });
    }
    const result = await prisma.messages.update({
      where: {
        device_id: device_id,
      },
      data: {
        messageArray: messageArray,
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

exports.updateMessages = catchAsync(async (req, res, next) => {
  try {
    const { device_id, messageArray } = req?.body;

    if (!device_id || !messageArray) {
      return next(
        new AppError(
          !device_id ? 'Device_id is required!' : 'Message array is required',
          400,
          res,
        ),
      );
    }

    const check = await prisma.device.findFirst({
      where: {
        id: device_id,
      },
      include: { messages: true },
    });

    if (!check) {
      return next(new AppError('Device id not found!', 404, res));
    }

    if (!check.messages) {
      return next(new AppError('Record not found!', 404, res));
    }

    const result = await prisma.messages.update({
      where: {
        device_id: device_id,
      },
      data: {
        messageArray: messageArray,
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

exports.getMessagesByDeviceId = catchAsync(async (req, res, next) => {
  try {
    const device_id = parseInt(req.params.device_id);
    if (!device_id) {
      return next(new AppError('Device_id is required!', 400, res));
    }

    const result = await prisma.messages.findMany({
      where: {
        device_id: device_id,
      },
    });

    if (result.length == 0) {
      return next(new AppError('Record not found!', 404, res));
    }

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});
