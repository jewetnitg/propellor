var World;


module.exports.World = World = function(callback) {

  this.pages = {
    'index': '/index',
    'login': '/login'
  };

  this.instantiate = function(arg) {
    this.baseObject = {};
  };

  this.set = function(key, value) {
    this.baseObject[key] = value;
  };

  this.get = function(arg) {
    return this.baseObject[arg];
  };

  this.result = function() {
    this.baseObject;
  };

  this.doBeforeScenario = function() {
    console.log('Before scenario prep code');
  };

  this.doAfterScenario = function() {
    console.log('After scenario cleanup code');
  };

  callback();
};
