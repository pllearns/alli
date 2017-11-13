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

const sendTextMessage = (recipientId, messageText) => {
  let messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  }

  callSendAPI(messageData)
}

module.exports = {
  sendIntroMessage,
  sendAdditionalInfoMessage,
  sendTextMessage
}