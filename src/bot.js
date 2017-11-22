'use strict';

const botBuilder = require('claudia-bot-builder');

// See: https://github.com/claudiajs/claudia-bot-builder/blob/c76ac0a2234d1ce51c4e6c566c076207a707d759/docs/API.md#selecting-platforms
// to learn about platforms supported by claudia-bot-builder.
var enabledPlatforms = [
  'facebook',
  'telegram',
  'skype',
  'viber',
  'slackSlashCommand',
  'alexa',
  'line'
];

module.exports = botBuilder(function(message) {
  return message.text;
}, { platforms: enabledPlatforms });
