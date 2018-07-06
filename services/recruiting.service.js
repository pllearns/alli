'use strict';

const meetupService = require('./meetup.service')

const recruitingService = {
  getRecruitingServices,

};

function getRecruitingServices(recipientId) {
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
              title: "Hired.com",
              subtitle: "Let's get you hired on hired.com!",
              image_url: "https://hired.com/assets/social-logo-large-81f971030413e5f8752ef72114cb852dc041b9b75857af25ceb97d99835121f2.png",
              default_action: {
                type: "web_url",
                url: "https://hired.com/",
                messenger_extensions: false,
                webview_height_ratio: "tall"
              }
            },
            {
              title: "Triplebyte",
              subtitle: "Are you ready for coding challenges?",
              image_url: "https://dvokhk8ohqhd8.cloudfront.net/assets/ntriplebyte_logo_1200_630-01bf854bb84fb72fe3bae379993659ea00a06d60062c404610dd359fe09cf7a1.png",
              default_action: {
                type: "web_url",
                url: "https://triplebyte.com/",
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

module.exports = recruitingService;