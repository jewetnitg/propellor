var World;

var BaseObject  = require('../../assets/js/lib/entities/BaseObject');

module.exports.World = World = function(callback) {

  this.BaseObject = BaseObject;

  this.pages = {
    'index': '/index',
    'login': '/login'
  };

  this.instantiate = function(arg) {
    this.baseObject = new this.BaseObject(arg);
  };

  this.set = function(key, value) {
    this.baseObject.set(key, value);
  };

  this.get = function(arg) {
    return this.baseObject.get(arg);
  };

  this.result = function() {
    this.baseObject.get();
  };

  this.doBeforeScenario = function() {
    console.log('Before scenario prep code');
  };

  this.doAfterScenario = function() {
    console.log('After scenario cleanup code');
  };

  callback();
};
