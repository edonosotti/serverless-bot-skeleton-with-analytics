'use strict';

const Common = require('./common');
const Intents = require('./intents');
const ResourceManager = require('./resourcemanager');
const DialogflowClient = require('./dialogflowclient');
const ChatbaseClient = require('./chatbaseclient');
const FacebookBuilder = require('./builders/facebookbuilder');
const SkypeBuilder = require('./builders/skypebuilder');
const TelegramBuilder = require('./builders/telegrambuilder');
const ViberBuilder = require('./builders/viberbuilder');
const SlackBuilder = require('./builders/slackbuilder');
const AlexaBuilder = require('./builders/alexabuilder');

function MessageProcessor(
  request,
  dialogflowClientAccessToken,
  chatbaseApiKey
) {
  // ========================================
  // PRIVATE PROPERTIES
  // ========================================
  var dialogflowClient = new DialogflowClient(dialogflowClientAccessToken);
  var chatbaseClient = new ChatbaseClient(chatbaseApiKey);
  var res = null;
  var messageBuilder = null;
  var messageBuilders = {
    facebook: new FacebookBuilder(),
    skype: new SkypeBuilder(),
    telegram: new TelegramBuilder(),
    viber: new ViberBuilder(),
    slack: new SlackBuilder(),
    alexa: new AlexaBuilder(),
  };

  // ========================================
  // PRIVATE METHODS
  // ========================================
  var configureResourceManager = function(language) {
    // Load resources for the given language, if available, or default set
    res = new ResourceManager(((language) ? language : Common.DEFAULT_LANGUAGE));
  };

  var configureMessageBuilder = function(platform) {
    // Set the proper type of output message builder
    // according to the message source platform
    // and load localized resources into it
    var platformName = platform.split('-');
    if (messageBuilders[platformName[0]]) {
      messageBuilder = messageBuilders[platformName[0]];
      messageBuilder.setResourceManager(res);
    }
  };

  var getAlexaIntent = function(alexaPayload) {
    return alexaPayload &&
      alexaPayload.request &&
      alexaPayload.request.type === 'IntentRequest' &&
      alexaPayload.request.intent &&
      alexaPayload.request.intent.name;
  };

  var sendCannedResponse = function(message) {
    // Set default response to "I did not understand your message"
    var response = res.s('DID_NOT_UNDERSTAND');

    // If one or more canned responses have been provided by Dialogflow,
    // choose one from the list and return it
    if (message.responses && message.responses.length > 0) {
      response = message.responses[Math.floor(Math.random() * message.responses.length)];
    }

    return messageBuilder.renderMessage(response);
  };

  var buildResponse = function(inputMessage) {
    configureResourceManager(inputMessage.lang);
    configureMessageBuilder(inputMessage.type);

    // If an intent has been successfully decoded,
    // return a proper message
    if (inputMessage.intent) {
      switch (inputMessage.intent) {
        case Intents.MAGIC_TRICKS:
          return messageBuilder.renderMagicTricks();
        // Other intents will be ignored here because
        // they carry canned responses with them.
        // Such responses are set in Dialogflow.
      }
    }

    // If no custom response has been built, return a canned response
    return sendCannedResponse(inputMessage);
  };

  var processTextMessage = function(inputMessage) {
    // Parse the input message to decode user intent first
    return dialogflowClient.parse(inputMessage)
      .then(function(inputMessage, parsedMessage) {
        // Build a response for the user
        var outputMessage = buildResponse(parsedMessage);

        // Send stats to analytics platform
        return chatbaseClient.sendStats(
          parsedMessage.intent,
          inputMessage,
          outputMessage
        )
          .then(function(outputMessage, result) {
            if (!result.success) {
              // Stats errors will not block the execution,
              // users will still get a response
              console.error(result.error);
            }
            // Return the response
            return outputMessage;
          }.bind(null, outputMessage))
          .catch(function(error) {
            console.error(error);
          })
      }.bind(null, inputMessage));
  };

  var processAlexaMessage = function(inputMessage, request) {
    configureResourceManager(inputMessage.lang);
    configureMessageBuilder(inputMessage.type);

    var intent = getAlexaIntent(request.body);

    if (intent === 'ExitApp') {
      return messageBuilder.renderGoodbye();
    }

    return res.s('DID_NOT_UNDERSTAND');
  };

  // ========================================
  // PUBLIC METHODS
  // ========================================
  this.processMessage = function(inputMessage) {
    // Check if a valid message was sent
    // and process according to its type
    if (inputMessage.text) {
      return processTextMessage(inputMessage);
    }
    else if (inputMessage.type == 'alexa') {
      return processAlexaMessage(inputMessage, request);
    }

    return {};
  };
};

module.exports = MessageProcessor;
