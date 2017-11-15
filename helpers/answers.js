const callSendAPI = require('./apiHelper')

const sendIntroMessage = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Alli-Bot Into",
            subtitle: "Welcome to Alli-bot",
          }]
        }
      }
    }
  }
  callSendAPI(messageData)
}


const sendAdditionalInfoMessage = (recipientId) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Additional Info",
            subtitle: "For additional info on Alli-Bot, please check out these resources: ",
          }]
        }
      }
    }
  }
  callSendAPI(messageData)
}

function firstEntity(nlp, name) {
  return nlp && nlp.entities && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

const sendTextMessage = (recipientId, messageText) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  }

  function handleMessage(message) {
    const greeting = firstEntity(message.nlp, 'greeting');
    if (greeting && greeting.confidence > 0.8) {
      sendResponse('Hi There!')
    } else {
      callSendAPI(message)
    }
  }
  handleMessage(messageData)
}

module.exports = {
  sendIntroMessage,
  sendAdditionalInfoMessage,
  sendTextMessage
}