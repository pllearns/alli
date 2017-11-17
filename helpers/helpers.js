const { sendIntroMessage,
  sendAdditionalInfoMessage,
  sendTextMessage,
  sendResourceOfTheDayMessage
      } = require('./answers')

const callSendAPI = require('./apiHelper')
const eventService = require('../services/event.service')
const optionService = require('../services/option.service')
const greetingService = require('../services/greeting.service')
const nlpService = require('../services/nlp.service')
const handleQuickReplyResponse = require('./responseHelpers')

function handlePostback(event) {
  const
    senderId = event.sender.id,
    payload = event.postback.payload;

  let messageData = null;

  switch (payload.toLowerCase()) {
    case 'events':
      messageData = eventService.getFilterOptions(senderId);
      break;
    case 'jobs':
      break;
    case 'mentorship':
      break;
    default:
      console.log('nada yo');
  }

  callSendAPI(messageData);
}

function processMessageFromPage(event) {
  const
    senderID = event.sender.id,
    pageID = event.recipient.id,
    timeOfMessage = event.timestamp,
    message = event.message;

  let messageText = null;

  message.quick_reply ? handleQuickReplyResponse(event) : messageText = message.text;

  if (messageText) {
    const greeting = nlpService.intentDefined(message.nlp, 'greeting');
    console.log({ greeting });

    if (greeting && greeting.confidence > 0.8) {
      // todo: typing_on delay preceding responses
      const greeting = greetingService.timeSensitive();
      sendTextMessage(senderID, greeting);
      const messageData = optionService.getDefaultOptions(senderID);
      callSendAPI(messageData);
    } else {
      const messageData = optionService.getDefaultOptions(senderID);
      callSendAPI(messageData);
    }
  }
}

module.exports = {
  handlePostback, 
  processMessageFromPage
}
