const callSendAPI = require('./apiHelper')

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

module.exports = getImageAttachments