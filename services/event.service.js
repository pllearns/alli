'use strict';

const meetupService = require('./meetup.service')

const eventService = {
  getFilterOptions: getEventFilterOptions
};

function getEvents() {

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