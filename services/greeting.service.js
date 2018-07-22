'use strict';

const greetingService = {
    timeSensitive: getTimeSensitiveGreeting,
    addTimeGreeted: addTimeGreeted,
    timesGreeted: 0
};

function getTimeSensitiveGreeting() {
  const
      currentHour = new Date().getHours(),
      greetingMap = {
        morning: ['Good Morning!'],
        afternoon: ['Good afternoon!', 'Hey, hope your day is going well so far!'],
        evening: ['Good evening!', 'Hey, hope your day went well!']
      };

  let timeOfDay;

  if (12 < currentHour < 17) {
    timeOfDay = 'afternoon';
  } else if (17 < currentHour) {
    timeOfDay = 'evening';
  } else {
    timeOfDay = 'morning';
  }

  return greetingMap[timeOfDay][Math.floor(Math.random() * greetingMap[timeOfDay].length)];
}

function addTimeGreeted() {
    this.timesGreeted++;
}

module.exports = greetingService;