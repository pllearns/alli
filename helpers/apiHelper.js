const request = require('request')

const callSendAPI = (messageData) => {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, request, response, body) {
    if (!error && response.statusCode == 200) {
      let recipientId = body.recipient_id
      let messageId = body.messgage_id

      console.log('Successfully sent generic message with id %s to recipient %s',
        messageId, recipientId)
    } else {
      console.error('Unable to send message')
      console.error(response)
      console.error(error)
    }
  })
}

module.exports = callSendAPI