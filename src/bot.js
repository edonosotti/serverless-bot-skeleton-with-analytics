'use strict';

const BotBuilder = require('claudia-bot-builder');
const MessageProcessor = require('./lib/messageprocessor');

// See: https://github.com/claudiajs/claudia-bot-builder/blob/c76ac0a2234d1ce51c4e6c566c076207a707d759/docs/API.md#selecting-platforms
// to learn about platforms supported by claudia-bot-builder.
var enabledPlatforms = [
  'facebook',
  'telegram',
  'skype',
  'viber',
  'slackSlashCommand',
  'alexa'
];

// Create an instance of Claudia Bot Builder
module.exports = BotBuilder(function(message, request) {
  // Create an instance of the custom Message Processor
  var messageProcessor = new MessageProcessor(
    request,
    process.env.DIALOGFLOW_CLIENT_ACCESS_KEY,
    process.env.CHATBASE_API_KEY
  );
  // Return a response to the user
  return messageProcessor.processMessage(message);
}, { platforms: enabledPlatforms });
