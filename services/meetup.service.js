'use strict';

const request = require('request')
const config = require('../config')

const meetupService = {
  getEvents: getEvents,
  getEventsMessage: getEventsMessage,
  getPayloadElements: getPayloadElements
}

function getEvents(category) {
  request(`https://api.meetup.com/find/events?key=5933c78526527285251d2f0115047&topic_category=${category}&sign=true`, (error, response, body) => {
    return getPayloadElements(JSON.parse(body));
  })
}

function getEventsMessage(recipientId, category) {
  request(`https://api.meetup.com/find/events?key=5933c78526527285251d2f0115047&topic_category=${category}&sign=true`, (error, response, body) => {
    const payloadElements = getPayloadElements(JSON.parse(body));
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

    sendCallAPI(messageData);
  })
  
  return {
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