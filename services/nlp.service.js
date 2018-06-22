'use strict';

const nlpService = {
  intentDefined: intentDefined
};

function intentDefined(nlp, name) {
  return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

module.exports = nlpService;