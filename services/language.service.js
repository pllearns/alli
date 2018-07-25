'use strict';

const languageService = {
    getDisplayValue: getDisplayValue,
};

function getDisplayValue(language) {
    const languageMap = {
        'javascript': 'JavaScript',
        'python': 'Python',
        'ruby': 'Ruby',
        'go': 'Go',
        'php': 'PHP',
        'java': 'Java'
    };

    return languageMap[language.toLowerCase()];
}

module.exports = languageService;