'use strict';

const assert = require('assert');

const common = require('../../lib/common');
const resourcemanager = require('../../lib/resourcemanager');
const localizedstrings = require('../../res/' + common.DEFAULT_LANGUAGE + '/strings.js');

describe('src/lib/resourcemanager', function() {

  describe('#s(key, defaultValue)', function() {

    it('should return a localized resource string', function() {
      var res = new resourcemanager(common.DEFAULT_LANGUAGE);
      var result = res.s('SPEC_TEST_STRING');
      assert.equal(result, localizedstrings.SPEC_TEST_STRING);
    });

    it('should return a default value if resource is not available', function() {
      var res = new resourcemanager(common.DEFAULT_LANGUAGE);
      var result = res.s('__TEST__KEY__', '__TEST__RESULT__');
      assert.equal(result, '__TEST__RESULT__');
    });

    it('should fall back to the default language if localized resources are not available', function() {
      var res = new resourcemanager('xx');
      var result = res.s('SPEC_TEST_STRING');
      assert.equal(result, localizedstrings.SPEC_TEST_STRING);
    });

  });

  describe('#ts(key, values defaultValue)', function() {

    it('should return a template resource string with applied values', function() {
      var res = new resourcemanager(common.DEFAULT_LANGUAGE);
      var result = res.ts('SPEC_TEST_TEMPLATE_STRING', { TEMPLATE: 'VALID' });
      var validString = localizedstrings.SPEC_TEST_TEMPLATE_STRING.replace('{{TEMPLATE}}', 'VALID');
      assert.equal(result, validString);
    });

  });

  describe('#getLanguage()', function() {

    it('should return the current language code', function() {
      var res = new resourcemanager(common.DEFAULT_LANGUAGE);
      var result = res.getLanguage();
      assert.equal(result, common.DEFAULT_LANGUAGE);
    });

  });

});
