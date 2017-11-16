'use strict';

const meetupService = {
  getEvents: getEvents
};

function getEvents(category, lat, lon) {
      // todo :: get to meetup using lon/lat
    // https://api.meetup.com/find/events?topic_category=${category}&lat=${lat}&lon=${lon}&sign=true
}

module.exports = meetupService;