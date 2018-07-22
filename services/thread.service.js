'use strict';

const threadService = {
    setCurrentThread: setCurrentThread,
    getCurrentThread: getCurrentThread
};

const threadHistory = [];

function intentDefined(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

function getCurrentThread() {
    return threadHistory.slice(-1)[0];
}

function setCurrentThread(threadName) {
    threadHistory.push(threadName);
}

module.exports = threadService;