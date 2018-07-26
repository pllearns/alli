'use strict';

const users = [];

const userService = {
    newUser: newUser,
    getUser: getUser,
    updateUser: updateUser,
    setLocation: setLocation,
    setLanguage: setLanguage
};

function getUser(senderId) {
    return users.find(user => user.id === senderId);
}

function newUser(senderId) {
    const newUser = new User(senderId);
    users.push(newUser);
    return newUser;
}

function updateUser(userId, prop, value) {
    let user = getUser(userId);
    user[prop] = value;
}

function setLanguage(language) {
    user.language = language;
}

function setLocation(location) {
    user.location = location;
}

function User(senderId) {
    this.id = senderId;
    this.location = null;
    this.language = null;
    this.idkMessages = 0;
    this.greeted = false;
    this.silentTreatment = false;
    this.attemptsToTalk = 0;
}

module.exports = userService;