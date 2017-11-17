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

const receivedMessage = (event) => {
  let senderID = event.sender.id
  let recipientID = event.recipient.id
  let timeOfMessage = event.timestamp
  let message = event.message
  let messageData = null
  console.log('Received message for user %d and page %d at %d with message: ',
    senderID, recipientID, timeOfMessage)
  console.log(JSON.stringify(message))

  let messageID = message.mid
  let messageText = message.text
  let messageAttachments = message.attachments

  if (messageText) {
    switch (messageText) {
      case 'What is Alli?':
        sendIntroMessage(senderID)
        break

      case 'Where can I get more info?':
        sendAdditionalInfoMessage(senderID)
        break

      case 'I need help':
        sendResourceOfTheDayMessage(senderID)
        break

      case 'events': 
        messageData = eventService.getFilterOptions(senderID)
        break
      
      case 'jobs': 
        break

      case 'mentorship': 
        break

      default:
        sendTextMessage(senderID, messageText)
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received")
  }
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
  receivedMessage, 
  processMessageFromPage
}
