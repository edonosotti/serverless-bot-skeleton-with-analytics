'use strict';

const botBuilder = require('claudia-bot-builder');
const slackTemplate = botBuilder.slackTemplate;
const S = require('string');
const Common = require('../common');
const Data = require('../data');

function SlackBuilder() {
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
    // Build a nice set of images with buttons and links
    // Reference: https://github.com/claudiajs/claudia-bot-builder/blob/c76ac0a2234d1ce51c4e6c566c076207a707d759/docs/SLACK_MESSAGE_MESSAGE_BUILDER.md
    var message = new slackTemplate(res.s('LABEL_LIST'));

    for (let img of Data.IMAGES) {
      var parameters = { ID: img.ID };
      var thumbnailUrl = S(Common.IMAGES_SOURCE).template(parameters).s;
      message = message
        .addAttachment(
          img.ID.toString(),
          res.s('SLACK_ATTACHMENT_ERROR')
        )
        .addTitle(
          res.ts('LABEL_IMAGE', { ID: img.ID }),
          img.URL
        )
        .addText(res.ts('LABEL_BY', { AUTHOR: img.AUTHOR }))
        .addImage(thumbnailUrl);
    }

    return message.get();
  };

  this.renderMessage = function(message) {
    return message;
  };
}

module.exports = SlackBuilder;
