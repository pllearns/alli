'use strict';
const callSendAPI = require('./apiHelper');

const
    goodbyeService = require('../services/goodbye.service'),
    nlpService = require('../services/nlp.service'),
    eventService = require('../services/event.service'),
    optionService = require('../services/option.service'),
    mentorService = require('../services/mentor.service'),
    meetupService = require('../services/meetup.service'),
    messageService = require('../services/message.service'),
    recruitingService = require('../services/recruiting.service'),
    jobService = require('../services/jobs.service'),
    threadService = require('../services/thread.service'),
    userService = require('../services/user.service'),
    greetingService = require('../services/greeting.service');

function handlePostback(event) {
    const
        senderId = event.sender.id,
        payload = event.postback ? event.postback.payload : event.message.quick_reply.payload;

    let messageData = null;

    if (payload.toLowerCase().endsWith('_events')) {
        const eventCategory = payload.toLowerCase().split('_')[0];
        meetupService.getEvents(eventCategory, senderId);
    }

    if (payload.toLowerCase().endsWith('_jobs')) {
        const jobCategory = payload.toLowerCase().split('_')[0];
        jobService.getJobsMessage(jobCategory, senderId);
    }

    switch (payload.toLowerCase()) {
        case 'events':
            messageData = eventService.getFilterOptions(senderId);
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

        // case 'js':
        //     jobService.getJobsMessage(senderId, 'javascript', 'SF');
        //     break;
        //
        // case 'java':
        //     jobService.getJobsMessage(senderId, 'java', 'SF');
        //     break;
        //
        // case 'ruby':
        //     jobService.getJobsMessage(senderId, 'ruby', 'SF');
        //     break;
        //
        // case 'python':
        //     jobService.getJobsMessage(senderId, 'python', 'SF');
        //     break;
        //
        // case 'go':
        //     jobService.getJobsMessage(senderId, 'go', 'SF');
        //     break;
        //
        // case 'php':
        //     jobService.getJobsMessage(senderId, 'php', 'SF');
        //     break;
    }
    if (messageData) {
        callSendAPI(messageData);
    }
}

function processMessageFromPage(event) {
    const
        senderID = event.sender.id,
        pageID = event.recipient.id,
        timeOfMessage = event.timestamp,
        message = event.message,
        currentThread = threadService.getCurrentThread(),
        user = userService.getUser();

    console.log('user => ', user);
    let messageText = null;

    message.quick_reply ? handleQuickReplyResponse(event) : messageText = message.text;

    if (messageText) {
        const greeting = nlpService.intentDefined(message.nlp, 'greetings');
        const bye = nlpService.intentDefined(message.nlp, 'bye');
        const job = nlpService.intentDefined(message.nlp, 'employment');
        const recruiter = nlpService.intentDefined(message.nlp, 'recruiting');
        const help = nlpService.intentDefined(message.nlp, 'help');
        const events = nlpService.intentDefined(message.nlp, 'events');
        const languages = nlpService.intentDefined(message.nlp, 'languages');
        const location = nlpService.intentDefined(message.nlp, 'location');
        const preferences = nlpService.intentDefined(message.nlp, 'preferences');

        // Greeting
        if (greeting && greeting.confidence > 0.7) {
            if (greetingService.timesGreeted >= 1) {
                const timelyGreeting = greetingService.timeSensitive();
                messageService.sendTextMessage(senderID, `${timelyGreeting} I'm Alli and I'm your tech ally! 🙋🏾‍`);
                messageService.sendTextMessage(senderID, 'I can let you know about some upcoming events, find you a mentor, or even show you some jobs you might be interested in.');
                greetingService.addTimeGreeted();
            } else {
                const hellos = ['Well, we meet again!', 'Hey there!', 'Hiya!', 'Howdy!', 'Greetings!', 'Hi again!'],
                    randomIdx = Math.floor(Math.random() * Math.floor(hellos.length));
                messageService.sendTextMessage(senderID, hellos[randomIdx]);
            }
        }

        // Goodbye
        else if (bye && bye.confidence > 0.7) {
            const bye = goodbyeService.timeSensitiveBye();
            messageService.sendTextMessage(senderID, bye);
        }

        // Job
        else if (job && job.confidence > 0.7) {
            threadService.setCurrentThread('jobs');
            if (!user.location) {
                messageService.sendTextMessage(senderID, 'Which city would you like to search for jobs in?');
            } else {
                messageService.sendTextMessage(senderID, "Let's find some jobs. What language do you primarily code in?");
            }
        }

        // Preferences
        else if (preferences && preferences.confidence > 0.7) {
            if (currentThread === 'jobs') {
                messageService.sendTextMessage(senderID, "Sure. What city would you like to search in instead?");
            }
        }

        // Events
        else if (events && events.confidence > 0.7) {
            const messageData = eventService.getFilterOptions(senderID);
            callSendAPI(messageData);
        }

        // Recruiting
        else if (recruiter && recruiter.confidence > 0.7) {
            messageService.sendTextMessage(senderID, "Here are some popular recruiting resources.");
            const messageData = recruitingService.getRecruitingServices(senderID);
            callSendAPI(messageData);
        }

        // Help
        else if (help && help.confidence > 0.7) {
            const messageData = optionService.getDefaultOptions(senderID);
            callSendAPI(messageData);
        }

        // Languages
        else if (languages && languages.confidence > 0.7) {
            if (currentThread === 'jobs') {
                jobService.getJobsMessage(senderID, languages.value, user.location);
            }
        }

        // Location
        else if (location && location.confidence > 0.7) {
            if (currentThread === 'jobs') {
                userService.setLocation(location.value);
                messageService.sendTextMessage(senderID, "Let's find some jobs. What language do you primarily code in?");
            }
        }

        // IDK
        else {
            messageService.sendTextMessage(senderID, "Sorry, I didn't understand.");
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