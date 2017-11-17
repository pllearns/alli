'use strict';

const meetupService = require('./meetup.service')

const mentorService = {
  getFilterOptions: getMentorFilterOptions,
  getMentorForms,
  getMenteeForms
};

function getMentorForms(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          url: "https://docs.google.com/forms/d/e/1FAIpQLScRIAaY8IxAm1ToMlLygPzOiERRDRFJRB0qs3QTdrFW4Ql_cw/viewform?usp=sf_link",
          text: "Mentor Form"
        }
      }
    }
  }
}

function getMenteeForms(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          url: "https://docs.google.com/forms/d/e/1FAIpQLSc7_N7jDmO5a3P8NtE8U9cayv0vc8Zs9qaVIudF_F4gFNeG2A/viewform?usp=sf_link",
          text: "Mentee Form"
        }
      }
    }
  }
}

function getMentorFilterOptions(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: `Mentorship is awesome! What would you like to do?`,
          buttons: [
            {
              "type": "postback",
              "title": "Be a Mentor",
              "payload": "MENTOR"
            },
            {
              "type": "postback",
              "title": "Need a Mentor",
              "payload": "MENTEE"
            }
          ]
        }
      }
    }
  };
}

module.exports = mentorService;