require('dotenv').config();
const express = require('express');
const connectDb = require('./connectDb');
const helmet = require('helmet');
const cors = require('cors');
const { userRouter, authRouter } = require('./router');

const app = express();

/** Init middleware */
app.use(helmet());
app.use(cors());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));

/** Test */
app.get('/', (req, res) => {
  res.send('App running!');
});

/** Connect DB */
connectDb();

/** Routes */
app.use('/api/v1/', userRouter);
app.use('/api/v1/', authRouter);

/** Run express server */
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App listening on port ${port}!`));
