'use strict';

const
  bodyParser = require('body-parser'),
  config = require('./config'),
  crypto = require('crypto'),
  eventService = require('./services/event.service'),
  express = require('express'),
  greetingService = require('./services/greeting.service'),
  nlpService = require('./services/nlp.service'),
  optionService = require('./services/option.service'),
  mentorService = require('./services/mentor.service'),
  meetupService = require('./services/meetup.service'),
  messageService = require('./services/message.service'),
  jobService = require('./services/jobs.service'),
  request = require('request');

const app = express();

app.set('port', config.port);
app.set('view engine', 'ejs');

app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(express.static('public'));

const APP_SECRET = config.appSecret;
const VALIDATION_TOKEN = config.validationToken;
const PAGE_ACCESS_TOKEN = config.pageAccessToken;

// In an early version of this bot, the images were served from the local public/ folder.
// Using an ngrok.io domain to serve images is no longer supported by the Messenger Platform.
// Github Pages provides a simple image hosting solution (and it's free)
const IMG_BASE_PATH = 'https://rodnolan.github.io/posterific-static-images/';

// make sure that everything has been properly configured
if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN)) {
  console.error("Missing config values");
  process.exit(1);
}

function verifyRequestSignature(req, res, buf) {
  const signature = req.headers["x-hub-signature"];

  if (!signature) {
    // In DEV, log an error. In PROD, throw an error.
    console.error("Couldn't validate the signature.");
  } else {
    const
      elements = signature.split('='),
      signatureHash = elements[1],
      expectedHash = crypto.createHmac('sha1', APP_SECRET).update(buf).digest('hex');

    if (signatureHash !== expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

app.get('/webhook', function (req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === VALIDATION_TOKEN) {
    console.log("[app.get] Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Validation token mismatch.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  const data = req.body;

  if (data.object === 'page') {
    res.sendStatus(200);
    data.entry.forEach(function (pageEntry) {

      pageEntry.messaging.forEach(function (messagingEvent) {
        const propertyNames = Object.keys(messagingEvent);
        console.log("[app.post] Webhook event props: ", propertyNames.join());

        if (messagingEvent.message) {
          processMessageFromPage(messagingEvent);
        } else if (messagingEvent.postback) {
          handlePostback(messagingEvent);
        } else {
          console.log("[app.post] not prepared to handle this message type.");
        }

      });
    });


  }
});


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
    messageService.sendTextMessage(recipientId, 'Below are job opportunities you might be interested in!')
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
    const greeting = nlpService.intentDefined(message.nlp, 'greeting');
    console.log({ greeting });

    if (greeting && greeting.confidence > 0.8) {
      // todo: typing_on delay preceding responses
      const greeting = greetingService.timeSensitive();
      messageService.sendTextMessage(senderID, greeting);
      const messageData = optionService.getDefaultOptions(senderID);
      callSendAPI(messageData);
    } else {
      const messageData = optionService.getDefaultOptions(senderID);
      callSendAPI(messageData);
    }
  }
}

/*
 * user tapped a Quick Reply button; respond with the appropriate content
 *
 */
function handleQuickReplyResponse(event) {
  var senderID = event.sender.id;
  var pageID = event.recipient.id;
  var message = event.message;
  var payload = message.quick_reply.payload;

  console.log("[handleQuickReplyResponse] Handling quick reply response (%s) from sender (%d) to page (%d) with message (%s)",
    payload, senderID, pageID, JSON.stringify(message));

  handlePostback(event);

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


/*
 * This response uses templateElements to present the user with a carousel
 * You send ALL of the content for the selected feature and they swipe
 * left and right to see it
 *
 */
function getGenericTemplates(recipientId, requestForHelpOnFeature) {
  console.log("[getGenericTemplates] handling help request for %s",
    requestForHelpOnFeature);
  var templateElements = [];
  var sectionButtons = [];

  // each button must be of type postback but title
  // and payload are variable depending on which
  // set of options you want to provide
  var addSectionButton = function (title, payload) {
    sectionButtons.push({
      type: 'postback',
      title: title,
      payload: payload
    });
  };

  // Since there are only four options in total, we will provide
  // buttons for each of the remaining three with each section.
  // This provides the user with maximum flexibility to navigate

  switch (requestForHelpOnFeature) {
    case 'QR_ROTATION_1':
      addSectionButton('Photo', 'QR_PHOTO_1');
      addSectionButton('Caption', 'QR_CAPTION_1');
      addSectionButton('Background', 'QR_BACKGROUND_1');

      templateElements.push(
        {
          title: "Rotation",
          subtitle: "portrait mode",
          image_url: IMG_BASE_PATH + "01-rotate-landscape.png",
          buttons: sectionButtons
        },
        {
          title: "Rotation",
          subtitle: "landscape mode",
          image_url: IMG_BASE_PATH + "02-rotate-portrait.png",
          buttons: sectionButtons
        }
      );
      break;
    case 'QR_PHOTO_1':
      addSectionButton('Rotation', 'QR_ROTATION_1');
      addSectionButton('Caption', 'QR_CAPTION_1');
      addSectionButton('Background', 'QR_BACKGROUND_1');

      templateElements.push(
        {
          title: "Photo Picker",
          subtitle: "click to start",
          image_url: IMG_BASE_PATH + "03-photo-hover.png",
          buttons: sectionButtons
        },
        {
          title: "Photo Picker",
          subtitle: "Downloads folder",
          image_url: IMG_BASE_PATH + "04-photo-list.png",
          buttons: sectionButtons
        },
        {
          title: "Photo Picker",
          subtitle: "photo selected",
          image_url: IMG_BASE_PATH + "05-photo-selected.png",
          buttons: sectionButtons
        }
      );
      break;
    case 'QR_CAPTION_1':
      addSectionButton('Rotation', 'QR_ROTATION_1');
      addSectionButton('Photo', 'QR_PHOTO_1');
      addSectionButton('Background', 'QR_BACKGROUND_1');

      templateElements.push(
        {
          title: "Caption",
          subtitle: "click to start",
          image_url: IMG_BASE_PATH + "06-text-hover.png",
          buttons: sectionButtons
        },
        {
          title: "Caption",
          subtitle: "enter text",
          image_url: IMG_BASE_PATH + "07-text-mid-entry.png",
          buttons: sectionButtons
        },
        {
          title: "Caption",
          subtitle: "click OK",
          image_url: IMG_BASE_PATH + "08-text-entry-done.png",
          buttons: sectionButtons
        },
        {
          title: "Caption",
          subtitle: "Caption done",
          image_url: IMG_BASE_PATH + "09-text-complete.png",
          buttons: sectionButtons
        }
      );
      break;
    case 'QR_BACKGROUND_1':
      addSectionButton('Rotation', 'QR_ROTATION_1');
      addSectionButton('Photo', 'QR_PHOTO_1');
      addSectionButton('Caption', 'QR_CAPTION_1');

      templateElements.push(
        {
          title: "Background Color Picker",
          subtitle: "click to start",
          image_url: IMG_BASE_PATH + "10-background-picker-hover.png",
          buttons: sectionButtons
        },
        {
          title: "Background Color Picker",
          subtitle: "click current color",
          image_url: IMG_BASE_PATH + "11-background-picker-appears.png",
          buttons: sectionButtons
        },
        {
          title: "Background Color Picker",
          subtitle: "select new color",
          image_url: IMG_BASE_PATH + "12-background-picker-selection.png",
          buttons: sectionButtons
        },
        {
          title: "Background Color Picker",
          subtitle: "click ok",
          image_url: IMG_BASE_PATH + "13-background-picker-selection-made.png",
          buttons: sectionButtons
        },
        {
          title: "Background Color Picker",
          subtitle: "color is applied",
          image_url: IMG_BASE_PATH + "14-background-changed.png",
          buttons: sectionButtons
        }
      );
      break;
  }

  if (templateElements.length < 2) {
    console.error("each template should have at least two elements");
  }

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: templateElements
        }
      }
    }
  };

  return messageData;
}

/*
 * This response uses image attachments to illustrate each step of each feature.
 * This is less flexible because you are limited in the number of options you can
 * provide for the user. This technique is best for cases where the content should
 * be consumed in a strict linear order.
 *
 */
function getImageAttachments(recipientId, helpRequestType) {
  var textToSend = '';
  var quickReplies = [
    {
      "content_type": "text",
      "title": "Restart",
      "payload": "QR_RESTART"
    }, // this option should always be present because it allows the user to start over
    {
      "content_type": "text",
      "title": "Continue",
      "payload": ""
    } // the Continue option only makes sense if there is more content to show
    // remove this option when you are at the end of a branch in the content tree
    // i.e.: when you are showing the last message for the selected feature
  ];

  // to send an image attachment in a message, just set the payload property of this attachment object
  // if the payload property is defined, this will be added to the message before it is sent
  var attachment = {
    "type": "image",
    "payload": ""
  };

  switch (helpRequestType) {
    case 'QR_RESTART':
      sendHelpOptionsAsQuickReplies(recipientId);
      return;
      break;

    // the Rotation feature
    case 'QR_ROTATION_1':
      textToSend = 'Click the Rotate button to toggle the poster\'s orientation between landscape and portrait mode.';
      quickReplies[1].payload = "QR_ROTATION_2";
      break;
    case 'QR_ROTATION_2':
      // 1 of 2 (portrait, landscape)
      attachment.payload = {
        url: IMG_BASE_PATH + "01-rotate-landscape.png"
      }
      quickReplies[1].payload = "QR_ROTATION_3";
      break;
    case 'QR_ROTATION_3':
      // 2 of 2 (portrait, landscape)
      attachment.payload = {
        url: IMG_BASE_PATH + "02-rotate-portrait.png"
      }
      quickReplies.pop();
      quickReplies[0].title = "Explore another feature";
      break;
    // the Rotation feature


    // the Photo feature
    case 'QR_PHOTO_1':
      textToSend = 'Click the Photo button to select an image to use on your poster. We recommend visiting https://unsplash.com/random from your device to seed your Downloads folder with some images before you get started.';
      quickReplies[1].payload = "QR_PHOTO_2";
      break;
    case 'QR_PHOTO_2':
      // 1 of 3 (placeholder image, Downloads folder, poster with image)
      attachment.payload = {
        url: IMG_BASE_PATH + "03-photo-hover.png"
      }
      quickReplies[1].payload = "QR_PHOTO_3";
      break;
    case 'QR_PHOTO_3':
      // 2 of 3 (placeholder image, Downloads folder, poster with image)
      attachment.payload = {
        url: IMG_BASE_PATH + "04-photo-list.png"
      }
      quickReplies[1].payload = "QR_PHOTO_4";
      break;
    case 'QR_PHOTO_4':
      // 3 of 3 (placeholder image, Downloads folder, poster with image)
      attachment.payload = {
        url: IMG_BASE_PATH + "05-photo-selected.png"
      }
      quickReplies.pop();
      quickReplies[0].title = "Explore another feature";
      break;
    // the Photo feature


    // the Caption feature
    case 'QR_CAPTION_1':
      textToSend = 'Click the Text button to set the caption that appears at the bottom of the poster.';
      quickReplies[1].payload = "QR_CAPTION_2";
      break;
    case 'QR_CAPTION_2':
      // 1 of 4 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "06-text-hover.png"
      }
      quickReplies[1].payload = "QR_CAPTION_3";
      break;
    case 'QR_CAPTION_3':
      // 2 of 4: (hover, entering caption, mid-edit, poster with new caption
      attachment.payload = {
        url: IMG_BASE_PATH + "07-text-mid-entry.png"
      }
      quickReplies[1].payload = "QR_CAPTION_4";
      break;
    case 'QR_CAPTION_4':
      // 3 of 4 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "08-text-entry-done.png"
      }
      quickReplies[1].payload = "QR_CAPTION_5";
      break;
    case 'QR_CAPTION_5':
      // 4 of 4 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "09-text-complete.png"
      }
      quickReplies.pop();
      quickReplies[0].title = "Explore another feature";
      break;
    // the Caption feature



    // the Color Picker feature
    case 'QR_BACKGROUND_1':
      textToSend = 'Click the Background button to select a background color for your poster.';
      quickReplies[1].payload = "QR_BACKGROUND_2";
      break;
    case 'QR_BACKGROUND_2':
      // 1 of 5 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "10-background-picker-hover.png"
      }
      quickReplies[1].payload = "QR_BACKGROUND_3";
      break;
    case 'QR_BACKGROUND_3':
      // 2 of 5 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "11-background-picker-appears.png"
      }
      quickReplies[1].payload = "QR_BACKGROUND_4";
      break;
    case 'QR_BACKGROUND_4':
      // 3 of 5 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "12-background-picker-selection.png"
      }
      quickReplies[1].payload = "QR_BACKGROUND_5";
      break;
    case 'QR_BACKGROUND_5':
      // 4 of 5 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "13-background-picker-selection-made.png"
      }
      quickReplies[1].payload = "QR_BACKGROUND_6";
      break;
    case 'QR_BACKGROUND_6':
      // 5 of 5 (hover, entering caption, mid-edit, poster with new caption)
      attachment.payload = {
        url: IMG_BASE_PATH + "14-background-changed.png"
      }
      quickReplies.pop();
      quickReplies[0].title = "Explore another feature";
      break;
    // the Color Picker feature

    default:
      sendHelpOptionsAsQuickReplies(recipientId);
      return;

      break;
  }

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: textToSend,
      quick_replies: quickReplies
    }
  };
  if (attachment.payload !== "") {
    messageData.message.attachment = attachment;
    // text can not be specified when you're sending an attachment
    delete messageData.message.text;
  }

  return messageData;
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const
        recipientId = body.recipient_id,
        messageId = body.message_id;

      if (messageId) {
        console.log("[callSendAPI] message id %s sent to recipient %s",
          messageId, recipientId);
      } else {
        console.log("[callSendAPI] called Send API for recipient %s",
          recipientId);
      }
    } else {
      console.error("[callSendAPI] Send API call failed", response.statusCode, response.statusMessage, body.error);
    }
  });
}

app.listen(app.get('port'), function () {
  console.log('[app.listen] Node app is running on port', app.get('port'));
});

module.exports = app;

