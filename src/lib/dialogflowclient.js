'use strict';

const promisify = require('promisify-event');
const apiai = require('apiai');

function DialogflowClient(clientAccessToken) {
  // ========================================
  // PRIVATE PROPERTIES
  // ========================================
  var client = apiai(clientAccessToken);

  // ========================================
  // PRIVATE METHODS
  // ========================================
  var parseCannedResponses = function(result) {
    var cannedResponses = []
    if (result.fulfillment && result.fulfillment.messages && Array.isArray(result.fulfillment.messages)) {
      for (let cannedResponse of result.fulfillment.messages) {
        if (cannedResponse && cannedResponse.speech && cannedResponse.speech != "") {
          cannedResponses.push(cannedResponse.speech);
        }
      }
    }
    return cannedResponses;
  };

  var parseText = function(message) {
    var request = client.textRequest(message.text, {
        sessionId: message.sender
    });

    var response = promisify(request, 'response');

    promisify(request, 'error')
      .catch(function(error) {
        console.error(error);
      });

    request.end();

    return response
      .then(function(data) {
        return {
          success: true,
          lang: data.lang,
          intent: data.result.action,
          parameters: data.result.parameters,
          responses: parseCannedResponses(data.result)
        }
      });
  }

  // ========================================
  // PUBLIC METHODS
  // ========================================
  this.parse = function(message) {
    if (message.text && message.text != '') {
      return parseText(message);
    } else {
      return new Promise(
        function(resolve, reject) {
          resolve({
            success: false,
            error: 'MESSAGE_TYPE_NOT_SUPPORTED'
          });
        });
    }
  }
};

module.exports = DialogflowClient;
