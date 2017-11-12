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
            subtitle: "A Classic Space Saga",
            text: "I am chatBot that helps you find opportunities in tech teh defy convention and tradition. Let's shake up the pipeline"
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
            text: "Events: [we will soon have current events for you to attend], Job Opps: [jobs!!], Mentorship: [Let's find you a mentor!]"
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