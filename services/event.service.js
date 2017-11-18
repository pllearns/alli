'use strict';
const config = require('../config')
const callSendAPI = require('../helpers/apiHelper')
const request = require('request')

const meetupService = require('./meetup.service')

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
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: `Great! What type of events are you interested in?`,
          buttons: [
            {
              "type": "postback",
              "title": "Women in Tech",
              "payload": "WOMEN_EVENTS"
            },
            {
              "type": "postback",
              "title": "LGBTQ",
              "payload": "LGBTQ_EVENTS"
            },
            {
              "type": "postback",
              "title": "Other",
              "payload": "OTHER_EVENTS"
            }
          ]
        }
      }
    }
  };
}

module.exports = eventService;