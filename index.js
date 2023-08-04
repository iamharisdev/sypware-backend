const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const routes = require('./routes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;
const corsOptions = {
  origin: '*',
};

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '10kb' }));
app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/uploads', express.static('./uploads'));

//call all routes
app.use('/api/v1', routes);

//testing route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hello world application!' });
});

//not fount url
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404, res));
});

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Listening to requests on port ${port}`);
});
