'use strict';
const callSendAPI = require('./apiHelper');

const
  greetingService = require('../services/greeting.service'),
  goodbyeService = require('../services/goodbye.service'),
  nlpService = require('../services/nlp.service'),
  eventService = require('../services/event.service'),
  optionService = require('../services/option.service'),
  mentorService = require('../services/mentor.service'),
  meetupService = require('../services/meetup.service'),
  messageService = require('../services/message.service'),
  recruitingService = require('../services/recruiting.service'),
  jobService = require('../services/jobs.service');

function handlePostback(event) {
  const
    senderId = event.sender.id,
    payload = event.postback ? event.postback.payload : event.message.quick_reply.payload;

  let messageData = null;

  switch (payload.toLowerCase()) {
    case 'events':
      messageData = eventService.getFilterOptions(senderId);
      break;

    case 'women_events':
      meetupService.getEventsMessage(senderId, 'women');
      break;

    case 'lgbtq_events':
      meetupService.getEventsMessage(senderId, 'lgbt');
      break;

    case 'black_events':
      meetupService.getEventsMessage(senderId, 'black');
      break;

    case 'latinx_events':
      meetupService.getEventsMessage(senderId, 'latino');
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

    case 'jobs':
      messageData = jobService.getFilterOptions(senderId);
      break;

    case 'js':
      jobService.getJobsMessage(senderId, 'javascript', 'SF');
      break;

    case 'java':
      jobService.getJobsMessage(senderId, 'java', 'SF');
      break;

    case 'ruby':
      jobService.getJobsMessage(senderId, 'ruby', 'SF');
      break;

    case 'python':
      jobService.getJobsMessage(senderId, 'python', 'SF');
      break;

    case 'go':
      jobService.getJobsMessage(senderId, 'go', 'SF');
      break;

    case 'php':
      jobService.getJobsMessage(senderId, 'php', 'SF');
      break;
  }
  if (messageData) {
    callSendAPI(messageData);
  }
}

function getJobsMessage(recipientId, category) {
  request(`https://jobs.github.com/positions.json?lat=${lat}&${long}`, (error, response, body) => {

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
    messageService.sendTextMessage(recipientId, 'Below are job opportunities you might be interested in!');
    callSendAPI(messageData);
  })
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
    const greeting = nlpService.intentDefined(message.nlp, 'greetings');
    const bye = nlpService.intentDefined(message.nlp, 'bye')
    console.log({ greeting });
    console.log({ bye })

    if (greeting && greeting.confidence > 0.8) {
      // todo: typing_on delay preceding responses
      const greeting = greetingService.timeSensitive();
      messageService.sendTextMessage(senderID, greeting);
      const messageData = optionService.getDefaultOptions(senderID);
      callSendAPI(messageData);
    } else if (bye && bye.confidence > 0.8) {
      const bye = goodbyeService.timeSensitiveBye();
      messageService.sendTextMessage(senderID, bye);
    } else if ('I need a job') {
      const messageData = recruitingService.getRecruitingServices(senderID);
      callSendAPI(messageData);
    } else {
      const messageData = optionService.getDefaultOptions(senderID);
      callSendAPI(messageData);
    }
  }
}

function handleQuickReplyResponse(event) {
  var senderID = event.sender.id;
  var pageID = event.recipient.id;
  var message = event.message;
  var payload = message.quick_reply.payload;

  console.log("[handleQuickReplyResponse] Handling quick reply response (%s) from sender (%d) to page (%d) with message (%s)",
    payload, senderID, pageID, JSON.stringify(message));

  handlePostback(event);

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
  handlePostback,
  processMessageFromPage
}