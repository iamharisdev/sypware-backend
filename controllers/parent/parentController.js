const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
const prisma = require('../../prisma');

exports.getAll = catchAsync(async (req, res, next) => {
  const childs = await prisma.user.findMany();
  res.status(200).json({
    status: 'success',
    data: {
      childs: childs,
    },
  });
});

exports.getChildsByParent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const children = await prisma.user.findMany({
    where: {
      id: Number(id),
    },
    include: {
      Child: true,
    },
  });
  if (!children.length) {
    return next(
      new AppError('Parent not found or no children associated', 404),
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      children,
    },
  });
});
