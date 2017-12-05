const express = require('express');
const app = express();

app.use(express.static('public'));

// sqlite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// cors
const cors = require('cors');
app.use(cors());

// error handler
const errorHandler = require('errorhandler');
app.use(errorHandler());

//morgan
// const morgan = require('morgan');
// app.use(morgan('dev'));

//body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

//API router
const apiRouter = require('./api/api');
app.use('/api', apiRouter);

//start server listen on PORT
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
