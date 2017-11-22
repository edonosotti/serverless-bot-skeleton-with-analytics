'use strict';

const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;

function FacebookFormatter() {
  // ========================================
  // PRIVATE PROPERTIES
  // ========================================
  var res = null;

  // ========================================
  // PUBLIC METHODS
  // ========================================
  this.setResourceManager = function(resourceManager) {
    res = resourceManager;
  };

  this.sendMessage = function(message) {
    return message;
  };
}

module.exports = FacebookFormatter;
