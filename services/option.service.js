'use strict';

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
          text: `I'm Alli. What can I help with?`,
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