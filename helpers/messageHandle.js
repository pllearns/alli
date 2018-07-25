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
    greetingService = require('../services/greeting.service'),
    languageService = require('../services/language.service');

let idkMessages = 0;

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
    console.log('currentThread => ', currentThread);
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
        const quiz = nlpService.intentDefined(message.nlp, 'quiz');
        const mentee = nlpService.intentDefined(message.nlp, 'mentorship');

        console.log('preferences => ', preferences);
        console.log('location => ', location);
        console.log('languages => ', languages);
        console.log('job => ', job);

        console.log('MAIN EVENT ====> ', event);

        // Greeting
        if (greeting && greeting.confidence > 0.7) {
            resetIdkMessages();
            greetingService.addTimeGreeted();
            if (greetingService.timesGreeted === 1) {
                const timelyGreeting = greetingService.timeSensitive();
                messageService.sendTextMessage(senderID, `${timelyGreeting} I'm Alli and I'm your tech ally! 🙋🏾‍`);
                setTimeout(() => {
                    const message = 'I can let you know about some upcoming *events*, find you a *mentor*, or even show you some *jobs* you might be interested in.';
                    messageService.sendTextMessage(senderID, message);
                }, 3000);
            } else {
                const hellos = ['Well, we meet again!', 'Hey there!', 'Hiya!', 'Howdy!', 'Greetings!', 'Hi again!'],
                    randomIdx = Math.floor(Math.random() * Math.floor(hellos.length));
                messageService.sendTextMessage(senderID, hellos[randomIdx]);
            }
        }

        // Goodbye
        else if (bye && bye.confidence > 0.7) {
            resetIdkMessages();
            const bye = goodbyeService.timeSensitiveBye();
            messageService.sendTextMessage(senderID, bye);
        }

        // Job
        else if (job && job.confidence > 0.7) {
            resetIdkMessages();
            threadService.setCurrentThread('jobs');
            if (!user.location) {
                messageService.sendTextMessage(senderID, 'Which city would you like to search for jobs in?');
            } else {
                messageService.sendTextMessage(senderID, `What language do you want to code in?`);
            }
        }

        // Preferences
        else if (preferences && preferences.confidence > 0.7) {
            resetIdkMessages();
            const previousThread = threadService.getCurrentThread();
            threadService.setCurrentThread('preferences');

            // User has asked to change their coding language
            if (languages && languages.confidence) {
                messageService.sendTextMessage(senderID, "Which language would you like to search for instead?");
                threadService.setCurrentThread(previousThread);
            }

            // User has asked to change their location
            if (location && location.confidence) {
                messageService.sendTextMessage(senderID, "What city would you like to search in instead?");
                threadService.setCurrentThread(previousThread);
            }
        }

        // Events
        else if (events && events.confidence > 0.7) {
            resetIdkMessages();
            threadService.setCurrentThread('events');
            const messageData = eventService.getFilterOptions(senderID);
            callSendAPI(messageData);
        }

        // Recruiting
        else if (recruiter && recruiter.confidence > 0.7) {
            resetIdkMessages();
            messageService.sendTextMessage(senderID, "Here are some popular recruiting resources.");
            const messageData = recruitingService.getRecruitingServices(senderID);
            callSendAPI(messageData);
        }
        // quiz and other info on SWE
        else if (quiz && quiz.confidence > 0.7) {
            resetIdkMessages();
            messageService.sendTextMessage(senderID, "Take a quiz or read more about becoming a software engineer.");
            const messageData = quizService.getQuizServices(senderID);
            callSendAPI(messageData);
        }

        // Mentor
        else if (mentee && mentee.confidence > 0.7) {
            resetIdkMessages();
            messageService.sendTextMessage(senderID, "Do you need a mentor? Check out these resources.");
            const messageData = mentorService.getMenteeForms(senderID);
            callSendAPI(messageData);
        }

        // Help
        else if (help && help.confidence > 0.7) {
            resetIdkMessages();
            messageService.sendTextMessage(senderID, "Never fear: Alli's here! 💁🏾‍");
            setTimeout(() => {
                messageService.sendTextMessage(senderID, "I can\'t move mountains (yet), but I can let you know about upcoming *events*, help find you a *mentor*, or show you some *jobs* you might be interested in.");

                setTimeout(() => {
                    messageService.sendTextMessage(senderID, "So, how can I help?");
                }, 3000);
            }, 3000);
        }

        // Languages
        else if (languages && languages.confidence > 0.7) {
            resetIdkMessages();
            const language = languages.value;
            const formattedLanguage = languageService.getDisplayValue(language);

            userService.setLanguage(language);

            if (currentThread === 'jobs') {
                jobService.getJobsMessage(senderID, languages.value, user.location);
            }

            if (!currentThread) {
                messageService.sendTextMessage(senderID, `Are you looking for ${formattedLanguage} jobs, events, or mentorship?`);
            }
        }

        // Location
        else if (location && location.confidence > 0.9) {
            resetIdkMessages();
            userService.setLocation(location.value);

            // User has entered the jobs thread and specified their location for the first time
            if (currentThread === 'jobs') {

                if (!user.language) {
                    messageService.sendTextMessage(senderID, "And what language do you primarily code in?");
                } else {
                    jobService.getJobsMessage(senderID, user.language, user.location);
                }
            }
        }
        // IDK
        else {
            idkMessages++;

            switch (idkMessages) {
                case 1:
                    messageService.sendTextMessage(senderID, "Sorry, I didn't understand that.");
                    break;
                case 2:
                    messageService.sendTextMessage(senderID, "Nope. Still didn't get it.");
                    break;
                case 3:
                    messageService.sendTextMessage(senderID, "I don't know about that, but what I do know are upcoming *events*, *mentorship* opportunities and *jobs* you might be interested in. Let me know which you'd like to learn more about.");
                    break;
                default:
                    setTimeout(() => {
                        const messageData = optionService.getDefaultOptions(senderID);
                        callSendAPI(messageData);
                    }, 1000);
            }
        }
    }
}

function resetIdkMessages() {
    idkMessages = 0;
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