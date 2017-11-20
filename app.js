'use strict';

const
  bodyParser = require('body-parser'),
  config = require('./config'),
  crypto = require('crypto'),
  express = require('express'),
  { handlePostback, processMessageFromPage } = require('./helpers/messageHandle'),
  request = require('request');

const app = express();

app.set('port', config.port);
app.set('view engine', 'ejs');

app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(express.static('public'));

const APP_SECRET = config.appSecret;
const VALIDATION_TOKEN = config.validationToken;
const PAGE_ACCESS_TOKEN = config.pageAccessToken;

const IMG_BASE_PATH = 'https://rodnolan.github.io/posterific-static-images/';

if (!(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN)) {
  console.error("Missing config values");
  process.exit(1);
}

function verifyRequestSignature(req, res, buf) {
  const signature = req.headers["x-hub-signature"];

  if (!signature) {
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

app.get('/', function(req, res) {
  res.send('Hey, I am a bot to help you get opportunities! Coming soon!!!')
})

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

app.listen(app.get('port'), function () {
  console.log('[app.listen] Node app is running on port', app.get('port'));
});

module.exports = app;

