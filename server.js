import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import jobRouter from './routers/jobRouter.js';
import mongoose from 'mongoose';
import 'express-async-errors';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import { body, validationResult } from 'express-validator';
import authRouter from './routers/authRouter.js';


const app = express();
dotenv.config();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/', (req, res) => {
  console.log(req);

  res.json({ message: 'Data received', data: req.body });
});

app.use('/api/v1/jobs', jobRouter);

app.use('/api/v1/auth', authRouter);

app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}