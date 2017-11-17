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

/*
 * simplify switching between the two help response implementations
 */
function respondToHelpRequest(senderID, payload) {
  // set useGenericTemplates to false to send image attachments instead of generic templates
  var useGenericTemplates = true;
  var messageData = {};

  if (useGenericTemplates) {
    // respond to the sender's help request by presenting a carousel-style
    // set of screenshots of the application in action
    // each response includes all the content for the requested feature
    messageData = getGenericTemplates(senderID, payload);
  } else {
    // respond to the help request by presenting one image at a time
    messageData = getImageAttachments(senderID, payload);
  }

  callSendAPI(messageData);
}

module.exports = {
  handleQuickReplyResponse,
  respondToHelpRequest
}