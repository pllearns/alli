'use strict';

const config = require('../config');
const callSendAPI = require('../helpers/apiHelper');
const request = require('request');

const meetupService = require('./meetup.service');

const eventService = {
  getFilterOptions: getEventFilterOptions,
  getEvents: getEvents
};

function getEvents(category) {
  request
    .get(`https://api.meetup.com/find/events?topic_category=${category}&sig_id=${config.meetupApiKey}`)
    .on('response', function (response) {
      console.log(response.statusCode) // 200
      console.log(response.headers['content-type']) // 'image/png'
    })
}

function getEventFilterOptions(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      text: `Way to get out there! Let's meet some new people. What type of events are you interested in?`,
      quick_replies: [
        {
          content_type: "text",
          title: "Women in Tech",
          payload: "WOMEN_EVENTS"
        },
        {
          content_type: "text",
          title: "LGBTQ",
          payload: "LGBTQ_EVENTS"
        },
        {
          content_type: "text",
          title: "Black in Tech",
          payload: "BLACK_EVENTS"
        },
        {
          content_type: "text",
          title: "Latinx in Tech",
          payload: "LATINX_EVENTS"
        }
          ]
      }
    }
  }

module.exports = eventService;