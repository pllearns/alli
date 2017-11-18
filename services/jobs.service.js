'use strict';

const meetupService = require('./meetup.service')

const jobsService = {
  getFilterOptions: getEventFilterOptions,
  getJobOpps
};


function getJobOpps(recipientId) {
  
  let lat = event.message.attachments[0].payload.coordinates.lat
  let long = event.message.attachments[0].payload.coordinates.long
  
  var myHeaders = new Headers();
  
  var myInit = {
    method: 'GET',
    headers: myHeaders,
    credentials: 'cors',
    cache: 'default'
  }

  fetch(`https://jobs.github.com/positions.json?lat=${lat}&${long}`, myInit).then(function(response) {
    return response.json()
  }).then(function(myBlob) {
    console.log(myBlob)
  })
}

function getEventFilterOptions(recipientId) {
  return {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: `Great! What type of jobs are you interested in?`,
          buttons: [
            {
              "type": "postback",
              "title": "Frontend Development",
              "payload": "FRONTEND_JOBS"
            },
            {
              "type": "postback",
              "title": "Backend Development",
              "payload": "BACKEND_JOBS"
            },
            {
              "type": "postback",
              "title": "Artificial Intelligence",
              "payload": "AI_JOBS"
            }
          ]
        }
      }
    }
  };
}

module.exports = jobsService