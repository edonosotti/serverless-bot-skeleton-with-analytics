'use strict';

const botBuilder = require('claudia-bot-builder');
const viberTemplate = botBuilder.viberTemplate;
const S = require('string');
const Common = require('../common');
const Data = require('../data');

function ViberBuilder() {
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
    // There is no built-it support for carousel-type messages for Telegram in
    // claudia-bot-builder, so in this case the bot will send a list
    // of subsequent Text, Photo and URL messages to achieve a similar effect.
    // See "Other attachments" in the reference to implement custom messages.
    // Reference: https://github.com/claudiajs/claudia-bot-builder/blob/c76ac0a2234d1ce51c4e6c566c076207a707d759/docs/TELEGRAM_CUSTOM_MESSAGES.md
    var messages = [];

    for (let img of Data.IMAGES) {
      var parameters = { ID: img.ID };
      var thumbnailUrl = S(Common.IMAGES_SOURCE).template(parameters).s;
      var title = [
        res.ts('LABEL_IMAGE', { ID: img.ID }),
        res.ts('LABEL_BY', { AUTHOR: img.AUTHOR }),
      ].join(' ');
      messages.push(new viberTemplate.Text(title).get());
      messages.push(new viberTemplate.Photo(thumbnailUrl).get());
      messages.push(new viberTemplate.Url(img.URL).get());
    }

    return messages;
  };

  this.renderMessage = function(message) {
    return message;
  };
}

module.exports = ViberBuilder;
