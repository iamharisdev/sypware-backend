const jwt = require('jsonwebtoken');
const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const prisma = require('../../prisma');

exports.createChild = catchAsync(async (req, res, next) => {
  const { name, phone_number, parent_id } = req.body;

  if (!name || !phone_number)
    return next(
      new AppError(
        'Pleaes provide both name and phone number of child!',
        400,
        res,
      ),
    );

  if (!parent_id) {
    return next(
      new AppError(
        'Pleaes provide parent id. Currently it is missing!',
        400,
        res,
      ),
    );
  }

  const check = await prisma.user.findFirst({
    where: {
      id: parent_id,
    },
    include: { Child: true },
  });

  if (!check) {
    return next(new AppError('Parent not found!', 404, res));
  }

  const newChild = await prisma.child.create({
    data: {
      name,
      phone_number,
      user: {
        connect: { id: parent_id },
      },
    },
  });

  let token = jwt.sign({ id: newChild.id }, process.env.JWT_SECRET);

  res.status(200).json({
    status: 'success',
    data: {
      child: newChild,
      childToken: token,
    },
  });
});

exports.updateChild = catchAsync(async (req, res, next) => {
  const { child_id, name, phone_number, parent_id } = req?.body;

  // Check if the child with the specified ID exists
  const existingChild = await prisma.child.findUnique({
    where: {
      id: child_id,
    },
  });

  if (!existingChild) {
    return next(new AppError('Child not found!', 400, res));
  }

  // Check if the parent with the specified ID exists
  const existingParent = await prisma.user.findUnique({
    where: {
      id: parent_id,
    },
  });

  if (!existingParent) {
    return next(new AppError('Parent not found!', 400, res));
  }

  const updatedChild = await prisma.child.update({
    where: {
      id: child_id,
    },
    data: {
      name: name,
      phone_number: phone_number,
      user: {
        connect: { id: parent_id },
      },
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      child: updatedChild,
    },
  });
});

exports.deleteChild = catchAsync(async (req, res, next) => {
  const { id } = req?.body;

  const existingChild = await prisma.child.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!existingChild) {
    return next(new AppError('Child not found!', 400, res));
  }

  await prisma.child.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Child deleted successfully.',
  });
});

exports.getAll = catchAsync(async (req, res, next) => {
  try {
    const childs = await prisma.child.findMany();

    if (childs.length == 0) {
      return next(new AppError('Child not found!', 404, res));
    }

    res.status(200).json({
      status: 'success',
      data: {
        childs: childs,
      },
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});

exports.getChildsByParentId = catchAsync(async (req, res, next) => {
  try {
    const parent_id = parseInt(req?.params?.parent_id);

    if (!parent_id) {
      return next(new AppError('Parent id is required!', 400, res));
    }

    const check = await prisma.user.findFirst({
      where: {
        id: parent_id,
      },
      include: { Child: true },
    });
    if (!check) {
      return next(new AppError('Parent is not found!', 404, res));
    }

    if (check.length == 0) {
      return next(new AppError('Child not found!', 404, res));
    }
    res.status(200).json({
      status: 'success',
      data: {
        childs: check.Child,
      },
    });
  } catch (e) {
    const { message } = e;
    return next(new AppError(message, 500, res));
  }
});
