'use strict';

const dotenv = require('dotenv');

dotenv.config();

const config = {
  appSecret: process.env.APP_SECRET,
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
  validationToken: process.env.VERIFY_TOKEN,
  port: process.env.PORT || 3000
};

module.exports = config;