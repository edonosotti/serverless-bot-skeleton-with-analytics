'use strict';

// Used for local testing
// require('dotenv').config({ path: __dirname + '/../../config/.env' });
const Common = require('./common');
const ResourceManager = require('./resourcemanager');
const DialogflowClient = require('./dialogflowclient');
const ChatbaseClient = require('@google/chatbase');
const FacebookFormatter = require('./formatters/facebookformatter');

// Coding style reference: https://github.com/airbnb/javascript/tree/8cf2c70a4164ba2dad9a79e7ac9021d32a406487#functions--signature-invocation-indentation
function MessageProcessor(
  inputMessage,
  dialogflowClientAccessToken,
  chatbaseApiKey,
) {
  // ========================================
  // PRIVATE PROPERTIES
  // ========================================
  var dialogflowClient = new DialogflowClient(dialogflowClientAccessToken);
  var res = null;
  var formatter = null;
  var formatters = {
    facebook: new FacebookFormatter()
  };

  // ========================================
  // PRIVATE METHODS
  // ========================================
  var configureResourceManager = function(language) {
    res = new ResourceManager(((language) ? language : Common.DEFAULT_LANGUAGE));
  };

  var configureFormatter = function(platform) {
    if (formatters[platform]) {
      formatter = formatters[platform];
      formatter.setResourceManager(res);
    }
  };

  var sendStats = function(inputMessage, responseMessage){
    var userId = inputMessage.type + '-' + inputMessage.sender;

    // Create a Message Set
    var messageSet = ChatbaseClient.newMessageSet()
      .setApiKey(chatbaseApiKey)
      .setPlatform(inputMessage.type);

    // Input message from user
    messageSet.newMessage()
      .setAsTypeUser()
      .setUserId(userId)
      .setIntent(responseMessage.intent)
      .setMessage(inputMessage.text);

    // Was it ?
    if (responseMessage.intent == 'input.unknown') {
      messageSet.setAsNotHandled();
    } else {
      messageSet.setAsHandled();
    }

    // Response message
    messageSet.newMessage()
  };

  var sendCannedResponse = function(message) {
    var response = res.s('DID_NOT_UNDERSTAND');
    if (message.responses && message.responses.length > 0) {
      response = message.responses[Math.floor(Math.random() * message.responses.length)];
    }

    return formatter.sendMessage(response);
  };

  var processMessage = function(message) {
    configureResourceManager(message.lang);
    configureFormatter(message.type);

    if (message.intent) {
      switch (message.intent) {
        case Intents.booking.ADD:
          return searchLocationForBooking(message);
        case Intents.booking.CONFIRM:
          return confirmBooking(message);
        case Intents.booking.SHOW_LOCATION_DETAILS:
          return showLocationDetails(message);
      }
    }

    return sendCannedResponse(message);
  };
};

module.exports = MessageProcessor;
