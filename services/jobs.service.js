'use strict';

const meetupService = require('./meetup.service')

const jobsService = {
  getFilterOptions: getEventFilterOptions
};

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
          text: `Great! What type of jobs are you interested in?`,
          buttons: [
            {
              "type": "postback",
              "title": "Frontend Development",
              "payload": "FRONTEND_JOBS"
            },
            {
              "type": "postback",
              "title": "Backend Development",
              "payload": "BACKEND_JOBS"
            },
            {
              "type": "postback",
              "title": "Fullstack Development",
              "payload": "FULLSTACK"
            }
          ]
        }
      }
    }
  };
}

module.exports = jobsService