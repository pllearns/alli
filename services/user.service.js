'use strict';

const user = {
  location: null
};

const userService = {
    getUser: getUser,
    setLocation: setLocation,
    setLanguage: setLanguage
};

function getUser() {
    return user;
}

function setLanguage(language) {
    user.language = language;
}

function setLocation(location) {
    user.location = location;
}

module.exports = userService;