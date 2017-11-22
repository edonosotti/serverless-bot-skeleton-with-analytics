'use strict';

const S = require('string');
const Common = require('./common');

function ResourceManager(language) {
  // ========================================
  // PRIVATE PROPERTIES
  // ========================================
  var lang = language;
  var stringResources = {};

  // ========================================
  // PRIVATE METHODS
  // ========================================
  var loadStringResources = function() {
    var stringResourcesPath = '../res/' + lang + '/strings.js';

    try {
      stringResources = require(stringResourcesPath);
    }
    catch (error) {
      console.error(error);
      if (error.code !== 'MODULE_NOT_FOUND') {
        throw error;
      } else {
        stringResources = require('../res/' + Common.DEFAULT_LANGUAGE + '/strings.js');
      }
    }
  };

  // ========================================
  // PUBLIC METHODS
  // ========================================
  this.s = function(key, defaultValue) {
    if (!defaultValue) { defaultValue = key; }
    var str = (stringResources[key] === undefined) ? defaultValue : stringResources[key];
    return (Array.isArray(str)) ? str[Math.floor(Math.random() * str.length)] : str;
  };

  this.ts = function(key, values, defaultValue) {
    var str = this.s(key, defaultValue);
    return S(str).template(values).s;
  };

  this.getLanguage = function() {
    return lang;
  };

  // ========================================
  // CONSTRUCTOR CODE
  // ========================================
  loadStringResources();
};

module.exports = ResourceManager;
