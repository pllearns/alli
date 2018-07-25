'use strict';

const request = require('request');
const config = require('../config');
const messageService = require('./message.service');
const languageService = require('./language.service');
const callSendAPI = require('../helpers/apiHelper');

const jobService = {
  getJobsMessage: getJobsMessage,
  getPayloadElements: getPayloadElements,
  getFilterOptions: getEventFilterOptions,
};

let informedOfChange = false;

function getJobsMessage(recipientId, category, locationName) {
  console.log('category => ', category, locationName);
  request(`https://jobs.github.com/positions.json?description=${category}&location=${locationName}`, (error, response, body) => {
    const payloadElements = jobService.getPayloadElements(JSON.parse(body));
    const messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: payloadElements,
          }
        }
      }
    };

    const formattedCategory = languageService.getDisplayValue(category);

    let message = `Here are some ${formattedCategory} jobs in ${locationName.capitalize()}.`;

    if (!payloadElements.length) {
        const message = `I couldn't find any ${category} jobs in ${locationName.capitalize()}. 🤷🏾‍`;
        messageService.sendTextMessage(recipientId, message);
    } else {
        messageService.sendTextMessage(recipientId, message);
        callSendAPI(messageData);
    }

    if (!informedOfChange) {
        setTimeout(() => {
            messageService.sendTextMessage(recipientId, 'If you want to search for jobs in a different language, just say the *language*.');
            informedOfChange = true;
        }, 2000);
    }

  })
}

function getPayloadElements(jobs) {

    const 
      payloadElements = [],
      max_carousel_units = 10;

  for (let i = 0; i < max_carousel_units && i < jobs.length; i++) {
    payloadElements.push({
      title: jobs[i].title,
      subtitle: jobs[i].company,
      image_url: jobs[i].company_logo,
      default_action: {
        type: 'web_url',
        url: jobs[i].url,
        messenger_extensions: false,
        webview_height_ratio: 'COMPACT',
      }
    })
  }

  return payloadElements;
}


function getEventFilterOptions(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      text: `Let's find you a new gig! What language do you primarily code in?`,
      quick_replies: [
        {
          content_type: "text",
          title: "JavaScript",
          payload: "javascript_jobs"
        },
        {
          content_type: "text",
          title: "Java",
          payload: "java_jobs"
        },
        {
          content_type: "text",
          title: "Ruby",
          payload: "ruby_jobs"
        },
        {
          content_type: "text",
          title: "Python",
          payload: "python_jobs"
        },
        {
          content_type: "text",
          title: "Go",
          payload: "go_jobs"
        },
        {
          content_type: "text",
          title: "PHP",
          payload: "php_jobs"
        }
      ]
    }
  };
}

module.exports = jobService;