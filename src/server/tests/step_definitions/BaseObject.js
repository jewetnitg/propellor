module.exports = function() {
  this.World = require('../support/world').World;

  this.Given(/^the BaseObject is instantiated$/, function(callback) {
    this.instantiate();
    callback();
  });

  this.When(/^I set (.+) to (.+)$/, function(key, val, callback) {
    this.set(key, val);
    callback();
  });

  this.Then(/^when I get (.+) again the value should be (.+)$/, function(key, val, callback) {
    var result = this.get(key);
    if (result == val) {
      callback();
    } else {
      callback.fail(new Error('Expected value to be ' + val));
    }
  });

};
