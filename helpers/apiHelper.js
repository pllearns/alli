const request = require('request')

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || config.pageAccessToken

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

module.exports = callSendAPI