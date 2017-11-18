'use strict';

const request = require('request')
const config = require('../config')
const messageService = require('./message.service')
const callSendAPI = require('../helpers/apiHelper')

const jobService = {
  getJobsMessage: getJobsMessage,
  getPayloadElements: getPayloadElements,
  getFilterOptions: getEventFilterOptions
}

function getJobsMessage(recipientId, category, locationName) {
  request(`https://jobs.github.com/positions.json?description=${category}&location=${locationName}`, (error, response, body) => {
    console.log('what the heck do I get???', body)
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
    messageService.sendTextMessage(recipientId, 'Below are job opportunities you might be interested in!')
    callSendAPI(messageData);
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
        webview_height_ratio: 'COMPACT',
      }
    })
  }

  return payloadElements
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
          payload: "JS"
        },
        {
          content_type: "text",
          title: "Java",
          payload: "JAVA"
        },
        {
          content_type: "text",
          title: "Ruby",
          payload: "RUBY"
        },
        {
          content_type: "text",
          title: "Python",
          payload: "PYTHON"
        },
        {
          content_type: "text",
          title: "Go",
          payload: "GO"
        },
        {
          content_type: "text",
          title: "PHP",
          payload: "PHP"
        }
      ]
    }
  };
}

module.exports = jobService;