const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const prisma = require('../../prisma');

exports.createDevice = catchAsync(async (req, res, next) => {
  try {
    const { data, child_id } = req.body;
    if (!data || !child_id) {
      return next(
        new AppError(
          !child_id ? 'Child id is required!' : 'Data is required!',
          400,
          res,
        ),
      );
    }

    const check = await prisma.child.findFirst({
      where: {
        id: child_id,
      },
      include: { device: true },
    });

    if (!check) {
      return next(new AppError('Child is not found!', 404, res));
    }
    if (check.device.length != 0) {
      return next(new AppError('Already device assign', 400, res));
    }

    const newDevice = await prisma.device.create({
      data: {
        ...data,
        child: {
          connect: { id: child_id },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: newDevice,
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});

exports.updateDevice = catchAsync(async (req, res, next) => {
  try {
    const { child_id, device_id, data } = req.body;
    if (!child_id || !device_id || !data) {
      return next(
        new AppError(
          !device_id
            ? 'Device_id is required!'
            : !child_id
            ? 'Child_id is required!'
            : 'data is required!',
          400,
          res,
        ),
      );
    }

    const check = await prisma.device.findFirst({
      where: {
        id: device_id,
        child_id: child_id,
      },
    });

    if (!check) {
      return next(new AppError('device not found!', 400, res));
    }

    const device = await prisma.device.update({
      where: {
        id: device_id,
      },
      data: data,
    });

    res.status(200).json({
      status: 'success',
      data: device,
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});

exports.getAllDevices = catchAsync(async (req, res, next) => {
  try {
    const child_id = parseInt(req.params.child_id);

    if (!child_id) {
      return next(new AppError('Child_id is required!', 400, res));
    }

    const check = await prisma.child.findMany({
      where: {
        id: child_id,
      },
      include: { device: true },
    });

    if (!check) {
      return next(new AppError('Child is not found!', 404, res));
    }

    if (check.length == 0) {
      return next(new AppError('No record found!'));
    }

    res.status(200).json({
      status: 'success',
      data: check,
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});

exports.getDevicebyDeviceId = catchAsync(async (req, res, next) => {
  try {
    const device_id = parseInt(req.params.device_id);

    if (!device_id) {
      return next(new AppError('Device_id is required!', 400, res));
    }

    const result = await prisma.device.findFirst({
      where: {
        id: device_id,
      },
    });

    if (!result) {
      return next(new AppError('Device not found!', 404, res));
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

exports.getDevicebyChildId = catchAsync(async (req, res, next) => {
  const id = parseInt(req?.query?.child_id);

  try {
    if (!id) {
      return next(new AppError('Child id is required!', 400, res));
    }

    const check = await prisma.child.findFirst({
      where: { id },
      include: { device: true },
    });

    if (!check) {
      return next(new AppError('Child not found!', 404, res));
    }

    if (check.device.length == 0) {
      return next(
        new AppError('There is no device assign this user', 404, res),
      );
    }

    res.status(200).json({
      status: 'success',
      data: check.device,
    });
  } catch (e) {
    const { message, statusCode } = e;
    return next(new AppError(message, statusCode, res));
  }
});

exports.ModulesTime = catchAsync(async (req, res, next) => {
  try {
    const { device_id, modules_enabled, modules_time } = req?.body;

    if (!device_id) {
      return next(new AppError('Device id is required!', 400, res));
    }

    const check = await prisma.device.findFirst({
      where: {
        id: device_id,
      },
      include: { modulesTime: true },
    });

    if (!check) {
      return next(new AppError('Device not found!', 404, res));
    }

    const device = await prisma.device.update({
      where: {
        id: device_id,
      },
      data: modules_enabled,
    });

    if (check.modulesTime.length == 0) {
      const time = await prisma.modulesTime.create({
        data: {
          ...modules_time,
          device: {
            connect: {
              id: device_id,
            },
          },
        },
      });

      res.status(200).json({
        status: 'success',
        data: {
          device: device,
          moduleTimes: time,
        },
      });
    }

    const time = await prisma.modulesTime.update({
      where: {
        device_id,
      },
      data: modules_time,
    });

    res.status(200).json({
      status: 'success',
      data: {
        device: device,
        moduleTime: time,
      },
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});

exports.createDevicePin = catchAsync(async (req, res, next) => {
  try {
    const { device_id, status, pin } = req.body;
    if (!device_id || !pin || !status)
      return next(
        new AppError(
          !device_id
            ? 'Please provide device_id!'
            : !status
            ? 'Please provide device status!'
            : 'Please provide screen pin!',
          400,
          res,
        ),
      );

    const check2 = await prisma.device.findFirst({
      where: {
        id: device_id,
      },
    });

    if (!check2) {
      return next(new AppError('Device not found!', 404, res));
    }

    const check = await prisma.screenLock.findUnique({
      where: {
        device_id: device_id,
      },
    });

    if (check) {
      return next(new AppError('Pin already created!', 400, res));
    }

    const newScreenLockPin = await prisma.screenLock.create({
      data: {
        device_id: device_id,
        status: status,
        pin: pin,
      },
    });
    res.status(200).json({
      status: 'success',
      data: newScreenLockPin,
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});

exports.loginWithPin = catchAsync(async (req, res, next) => {
  try {
    const { pin, device_id } = req?.body;

    if (!device_id || !pin) {
      return next(
        new AppError(
          !device_id ? 'Device_id is required!' : 'Pin is required',
          400,
          res,
        ),
      );
    }

    const check2 = await prisma.device.findFirst({
      where: {
        id: device_id,
      },
    });

    if (!check2) {
      return next(new AppError('Device not found!', 404, res));
    }
    const check = await prisma.screenLock.findFirst({
      where: {
        device_id: device_id,
      },
      include: {
        device: true,
      },
    });

    const result = await prisma.child.findFirst({
      where: {
        id: check.child_id,
      },
      include: {
        user: true,
      },
    });

    if (!check) {
      return next(new AppError('device not found!', 400));
    }

    if (check?.pin != pin) {
      return next(new AppError('Pin is not correct!', 400));
    }

    res.status(200).json({
      status: 'success',
      data: { ...check, ...result },
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});
