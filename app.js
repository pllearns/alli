const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('This is the Alli App')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})

