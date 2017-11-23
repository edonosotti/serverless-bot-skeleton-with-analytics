'use strict';

const botBuilder = require('claudia-bot-builder');
const skypeTemplate = botBuilder.skypeTemplate;
const S = require('string');
const Common = require('../common');
const Data = require('../data');

function SkypeBuilder() {
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
    // Reference: https://github.com/claudiajs/claudia-bot-builder/blob/c76ac0a2234d1ce51c4e6c566c076207a707d759/docs/SKYPE_CUSTOM_MESSAGES.md#thumbnail-messages
    var template = new skypeTemplate.Carousel();

    for (let img of Data.IMAGES) {
      var parameters = { ID: img.ID };
      var thumbnailUrl = S(Common.IMAGES_SOURCE).template(parameters).s;
      template = template
        .addThumbnail([thumbnailUrl])
        .addTitle(res.ts('LABEL_IMAGE', { ID: img.ID }))
        .addSubtitle(res.ts('LABEL_BY', { AUTHOR: img.AUTHOR }))
        .addText(res.s('LABEL_AVAILABLE_OPTIONS'))
        .addButton(res.s('BUTTON_OPEN_IMAGE'), img.URL, 'openUrl');
    }

    return template.get();
  };

  this.renderMessage = function(message) {
    return message;
  };
}

module.exports = SkypeBuilder;
