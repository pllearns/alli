'use strict';
const greetingService = require('../services/greeting.service');

const optionService = {
  getDefaultOptions: getDefaultOptions
};

function getDefaultOptions(recipientId) {

  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: 'What can I help with?',
          buttons: [
            {
              "type": "postback",
              "title": "Upcoming Events",
              "payload": "EVENTS"
            },
            {
              "type": "postback",
              "title": "Job Opportunities",
              "payload": "JOBS"
            },
            {
              "type": "postback",
              "title": "Mentorship",
              "payload": "MENTORSHIP"
            }
          ]
        }
      }
    }
  };
}

module.exports = optionService;