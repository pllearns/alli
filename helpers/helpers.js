const callSendAPI = require('./apiHelper')
const eventService = require('../services/event.service')
const jobsService = require('../services/jobs.service')
const optionService = require('../services/option.service')
const greetingService = require('../services/greeting.service')
const mentorService = require('../services/mentor.service')
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
      messageData = jobsService.getFilterOptions(senderId);
      break;
    case 'mentorship':
      messageData = mentorService.getFilterOptions(senderId);
      break;

    case 'mentor':
      messageData = mentorService.getMentorForms(senderId);
      break;

    case 'mentee':
      messageData = mentorService.getMenteeForms(senderId);
      break; 
    
    case 'frontend_jobs':
      messageData = jobsService.getJobOpps(senderId);
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
