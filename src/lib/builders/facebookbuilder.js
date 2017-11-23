'use strict';

const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;
const S = require('string');
const Common = require('../common');
const Data = require('../data');

function FacebookBuilder() {
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
    var generic = new fbTemplate.Generic();

    for (let img of Data.IMAGES) {
      var parameters = { ID: img.ID };
      var thumbnailUrl = S(Common.IMAGES_SOURCE).template(parameters).s;
      generic = generic
        .addBubble(
          res.ts('LABEL_IMAGE', { ID: img.ID }),
          res.ts('LABEL_BY', { AUTHOR: img.AUTHOR })
        )
        .addUrl(img.URL)
        .addImage(thumbnailUrl)
        .addButton(res.s('BUTTON_OPEN_IMAGE'), img.URL);
    }

    return generic.get();
  };

  this.renderMessage = function(message) {
    return message;
  };
}

module.exports = FacebookBuilder;
