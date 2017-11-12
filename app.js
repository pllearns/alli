const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('This is the Alli App')
})

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    console.log("Validating webhook")
    res.status(200).send(req.query['hub.challenge'])
  } else {
    console.error("Failed validation. Make sure the validation tokens match.")
    res.sendStatus(403);
  }
})

app.post('/webhook', (req, res) => {
  let data = req.body

  if (data.object === 'page') {
    data.entry.forEach((entry) => {
      let pageID = entry.id
      let timeOfEvent = entry.time

      entry.messaging.forEach((event) => {
        if (event.message) {
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

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})

