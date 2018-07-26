'use strict';

const
    request = require('request'),
    config = require('../config'),
    messageService = require('./message.service'),
    callSendAPI = require('../helpers/apiHelper');

const path = 'https://api.meetup.com/find';
const apiKey = config.meetupApiKey;

const meetupService = {
    getEvents: getEvents,
};

function getEvents(category, recipientId) {
    const eventsPath = `${path}/upcoming_events?key=${apiKey}&topic_category=292&text=${category}&sign=true`;
    request(eventsPath, (err, res, body) => {
        const data = JSON.parse(body);

        if (data.events.length) {
            const payloadElements = _getPayloadElements(data.events);
            const message = _getMessage(payloadElements, recipientId);
            messageService.sendTextMessage(recipientId, `Here are some upcoming events!`);
            callSendAPI(message);
        } else {
            const message = `Oh no.. it doesn't appear there are any upcoming events of that type in ${data.city.city}!`;
            messageService.sendTextMessage(recipientId, message);
            setTimeout(() => {
                const message = `Do you want to search for general tech events instead?`;
                messageService.sendTextMessage(recipientId, message);
            }, 3000);
        }

    });
}

const _getPayloadElements = (events) => {
    return events.map(e => {
        return ({
            title: e.name,
            subtitle: e.local_date || null,
            default_action: { type: 'web_url',  url: e.link },
        })
    });
};

const _getMessage = (elements, recipientId) => {
    return {
        recipient: { id: recipientId },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: elements
                }
            }
        }
    };
};


module.exports = meetupService;