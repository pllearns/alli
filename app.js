const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const {
  receivedMessage, 
  processMessageFromPage } = require('./helpers/helpers')

const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('This is the Alli App')
})

app.get('/webhook', (req, res) => {

  let VERIFY_TOKEN = process.env.VERIFY_TOKEN

  let mode = req.query['hub.mode']
  let token = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']

  if (mode && token) {

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      console.log('WEBHOOK_VERIFIED')
      res.status(200).send(challenge)

    } else {
      res.sendStatus(403)
    }
  }
})

app.post('/webhook', (req, res) => {
  let data = req.body

  if (data.object === 'page') {
    data.entry.forEach((entry) => {
      let pageID = entry.id
      let timeOfEvent = entry.time

      entry.messaging.forEach((event) => {
        const propertyNames = Object.keys(event)
        console.log("[app.post] Webhook event props: ", propertyNames.join())
        if (event.message) {
          processMessageFromPage(event)
        } else if (event.postback) {
          receivedMessage(event)
        } else {
          console.log('Webhook received unknown event', event)
        }
      })
    })

    res.sendStatus(200)
  }
})

app.listen(port, () => {
  console.log(`You are active on http://localhost:${port}`)
})


