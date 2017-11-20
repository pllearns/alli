'use strict';

const callSendAPI = require('./apiHelper')
const getGenericTemplates = require('./genericTemplates')
const getImageAttachments = require('./getImages')

function handleQuickReplyResponse(event) {
  var senderID = event.sender.id;
  var pageID = event.recipient.id;
  var message = event.message;
  var payload = message.quick_reply.payload;

  console.log("[handleQuickReplyResponse] Handling quick reply response (%s) from sender (%d) to page (%d) with message (%s)",
    payload, senderID, pageID, JSON.stringify(message));

  respondToHelpRequest(senderID, payload);

}

function respondToHelpRequest(senderID, payload) {
  var useGenericTemplates = true;
  var messageData = {};

  if (useGenericTemplates) {
    messageData = getGenericTemplates(senderID, payload);
  } else {
    messageData = getImageAttachments(senderID, payload);
  }

  callSendAPI(messageData);
}

module.exports = {
  handleQuickReplyResponse,
  respondToHelpRequest
}