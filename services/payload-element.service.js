'use strict';

const callSendAPI = require('../helpers/apiHelper')

const payloadElementService = {
    getPayloadElements: getPayloadElements
};

function getPayloadElements(recipientId, messageText) {
    const messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText // utf-8, 640-character max
        }
    };

    callSendAPI(messageData);
}

module.exports = messageService;