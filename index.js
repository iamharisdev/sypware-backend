const express = require('express');
var cors = require('cors');
const app = express();
const authRouter = require('./routes/authRoutes');
const childRouter = require('./routes/childRoutes');
const parentRouter = require('./routes/parentRoutes');
const deviceRouter = require('./routes/deviceRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const AppError = require('./utils/appError');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const globalErrorHandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');
var morgan = require('morgan');

var corsOptions = {
  origin: '*',
};
dotenv.config();

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/uploads', express.static('./uploads'));

app.use('/api/v1/users', authRouter);
app.use('/api/v1/child', childRouter);
app.use('/api/v1/parent', parentRouter);
app.use('/api/v1/device', deviceRouter);
app.use('/api/v1/notification', notificationRouter);
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hello world application!' });
});

app.all('*', (req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Listening to requests on port ${port}`);
});
