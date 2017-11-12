const { sendIntroMessage,
  sendAdditionalInfoMessage,
  sendTextMessage
      } = require('./answers')

const receivedMessage = (event) => {
  let senderID = event.sender.id
  let recipientID = event.recipient.id
  let timeOfMessage = event.timestamp
  let message = event.message
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

      default:
        sendTextMessage(senderID, messageText)
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received")
  }
}

module.exports = receivedMessage
