'use strict';

const goodbyeService = {
  timeSensitiveBye: getTimeSensitiveBye,
};

function getTimeSensitiveBye() {
  const
    currentHour = new Date().getHours(),
    byeMap = {
      morning: ['Bye, Have a great morning!'],
      afternoon: ['See you later!'],
      evening: ['I hope you have a great night!']
    };

  let timeOfDay;

  if (12 < currentHour < 17) {
    timeOfDay = 'afternoon';
  } else if (17 < currentHour) {
    timeOfDay = 'evening';
  } else {
    timeOfDay = 'morning';
  }

  return byeMap[timeOfDay][Math.floor(Math.random() * byeMap[timeOfDay].length)];
}

module.exports = goodbyeService;