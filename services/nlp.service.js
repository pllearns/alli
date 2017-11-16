'use strict';

const nlpService = {
  intentDefined: intentDefined
};

function intentDefined(nlp, intent) {
  return nlp && nlp.entities.intent && nlp.entities.intent[0].value === intent && nlp.entities.intent[0];
}

module.exports = nlpService;