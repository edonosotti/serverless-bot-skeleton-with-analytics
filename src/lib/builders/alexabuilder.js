'use strict';

const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;
const S = require('string');
const Common = require('../common');
const Data = require('../data');

function AlexaBuilder() {
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

  this.renderMagicTricks = function() {
    // Build a nice carousel of images with buttons and links
    // Reference: https://github.com/claudiajs/claudia-bot-builder/blob/c76ac0a2234d1ce51c4e6c566c076207a707d759/docs/FB_TEMPLATE_MESSAGE_BUILDER.md#generic-template
    var messages = [];

    messages.push(res.ts('ALEXA_IMAGES_TITLE', { COUNT: Data.IMAGES.length }));

    var images = [];
    for (let img of Data.IMAGES) {
      var imageDescription = [
        res.ts('LABEL_IMAGE', { ID: img.ID }),
        res.ts('LABEL_BY', { AUTHOR: img.AUTHOR }),
      ].join(' ');
      images.push(imageDescription);
    }

    messages.push(images.join(', '));

    return messages.join(' ');
  };

  this.renderGoodbye = function() {
    return {
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: res.s('ALEXA_GOODBYE')
        },
        shouldEndSession: true
      }
    };
  };

  this.renderMessage = function(message) {
    return message;
  };
}

module.exports = AlexaBuilder;
