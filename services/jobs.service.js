'use strict';

const request = require('request');
const config = require('../config');
const messageService = require('./message.service');
const callSendAPI = require('../helpers/apiHelper');

const jobService = {
  getJobsMessage: getJobsMessage,
  getPayloadElements: getPayloadElements,
  getFilterOptions: getEventFilterOptions
};

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

    let message = '';

    switch (category) {
      case 'javascript':
        message = 'You love JavaScript? These jobs should peak your interest!';
        break;
      case 'java':
        message = 'Java is awesome, and so are you! Time to find that next Java position!';
        break;
      case 'ruby':
        message = 'Riding the rails on Ruby, oh yeah! Here are some opportunities for Ruby Developers!';
        break;
      case 'python':
        message = 'The language of AI is just too cool, now on to a cool job in Python!';
        break;
      case 'go':
        message = 'golang all day! Jobs in this language are right below!';
        break;
      case 'php':
        message = 'Yep, php is the place to be, do some work!';
        break;
    }

    if (!payloadElements.length) { message = `Oh no. I couldn't find any ${category} jobs in ${locationName}.`}
    messageService.sendTextMessage(recipientId, message);
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