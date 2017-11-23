'use strict';

const promisify = require('promisify-event');
const chatbase = require('@google/chatbase');

const Intents = require('./intents');

function ChatbaseClient(apiKey) {
  // ========================================
  // PUBLIC METHODS
  // ========================================
  this.sendStats = function(intent, inputMessage, outputMessage) {
    // Create a Message Set
    // See: https://github.com/google/chatbase-node
    var messageSet = chatbase.newMessageSet()
      .setApiKey(apiKey)
      .setPlatform(inputMessage.type);

    // Track the message from the user
    const userMessage = messageSet.newMessage()
      .setAsTypeUser()
      .setUserId(inputMessage.type + '-' + inputMessage.sender)
      .setTimestamp(Date.now().toString())
      .setIntent(intent)
      .setMessage(inputMessage.text);

    // Was the intent successfully decoded?
    if (inputMessage.intent == Intents.UNKNOWN) {
      userMessage.setAsNotHandled();
    } else {
      userMessage.setAsHandled();
    }

    // Track the response message from the bot
    var outputMessageText = (typeof outputMessage === 'string') ?
      outputMessage : JSON.stringify(outputMessage);
    const botMessage = messageSet.newMessage()
      .setAsTypeAgent()
      .setUserId(inputMessage.type + '-' + inputMessage.sender)
      .setTimestamp(Date.now().toString())
      .setMessage(outputMessageText);

    // Send all messages to Chatbase
    return messageSet.sendMessageSet()
      .then(response => {
        var createResponse = response.getCreateResponse();
        return {
          success: createResponse.all_succeeded,
        };
      })
      .catch(error => {
        console.error(error);
        return {
          success: false,
          error: error,
        }
      });
  };
};

module.exports = ChatbaseClient;
