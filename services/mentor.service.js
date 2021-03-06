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
          template_type: "list",
          elements: [
            {
              title: "Mentor Form",
              subtitle: "Sign up to mentor!",
              image_url: "https://cdn.saultonline.com/wp-content/uploads/2017/09/rosie-tech.jpg",
              default_action: {
                type: "web_url",
                url: "https://docs.google.com/forms/d/e/1FAIpQLScRIAaY8IxAm1ToMlLygPzOiERRDRFJRB0qs3QTdrFW4Ql_cw/viewform?usp=sf_link",
                messenger_extensions: false,
                webview_height_ratio: "tall"
              }
            },
            {
              title: "How to be a great mentor",
              subtitle: "A great resource on how to be a mentor",
              image_url: "https://img.huffingtonpost.com/asset/594857ec15000026004e722e.jpg?ops=scalefit_820_noupscale",
              default_action: {
                type: "web_url",
                url: "https://blog.hubspot.com/marketing/mentor-tips-positive-impact",
                messenger_extensions: false,
                webview_height_ratio: "tall"
              }
            }
          ]
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
          template_type: "list",
          top_element_style: "compact",
          elements: [
            {
              title: "Mentee Form",
              subtitle: "Sign up to get mentorship!",
              image_url: "https://img.huffingtonpost.com/asset/594857ec15000026004e722e.jpg?ops=scalefit_820_noupscale",
              default_action: {
                type: "web_url",
                url: "https://docs.google.com/forms/d/e/1FAIpQLSc7_N7jDmO5a3P8NtE8U9cayv0vc8Zs9qaVIudF_F4gFNeG2A/viewform?usp=sf_link",
                messenger_extensions: false,
                webview_height_ratio: "tall"
              }
            },
            {
              title: "How to be a great mentee",
              subtitle: "Getting ready for your mentorship experience",
              image_url: "https://cdn.saultonline.com/wp-content/uploads/2017/09/rosie-tech.jpg",
              default_action: {
                type: "web_url",
                url: "http://superheroyou.com/good-mentee/",
                messenger_extensions: false,
                webview_height_ratio: "tall"
              }
            }
          ]
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