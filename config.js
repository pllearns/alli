'use strict';

const dotenv = require('dotenv');

dotenv.config();

const config = {
  appSecret: process.env.APP_SECRET,
  pageAccessToken: process.env.PAGE_ACCESS_TOKEN,
  validationToken: process.env.VALIDATION_TOKEN,
  meetupApiKey: process.env.MEETUP_API_KEY,
  port: process.env.PORT || 3000
};

module.exports = config;