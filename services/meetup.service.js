'use strict';

const request = require('request')
const config = require('../config')
const messageService = require('./message.service')
const callSendAPI = require('../helpers/apiHelper')

const meetupService = {
  getEventsMessage: getEventsMessage,
  getPayloadElements: getPayloadElements
}

function getEventsMessage(recipientId, category) {
  request(`https://api.meetup.com/find/upcoming_events?key=5933c78526527285251d2f0115047&topic_category=292&text=${category}&sign=true`, (error, response, body) => {

    const payloadElements = meetupService.getPayloadElements(JSON.parse(body));
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

    switch(category) {
      case 'women':
        message = 'Great! I\'m starting to see more tech events for women everyday. Let\'s see what events are coming up..';
        break;
      case 'lgbt':
        message = 'Awesome! LGBTQ events are really taking off! Here\'s what\'s on the calendar..';
        break;
      case 'black':
      case 'latinx':
    }

    messageService.sendTextMessage(recipientId, message)
    callSendAPI(messageData);
  })
}

function getPayloadElements(body) {
  const events              = body.events,
        payloadElements     = [],
        max_carousel_units  = 10;
  
  for (let i = 0; i < max_carousel_units && i < events.length; i++) {
    payloadElements.push({
      title: events[i].name,
      subtitle: events[i].local_date || Date.now(),
      default_action: {
        type: 'web_url',
        url: events[i].link
      }
    })
  }

  return payloadElements
}


module.exports = meetupService;