var expect = chai.expect;

describe('Application', function(){
  const Application = classes.Application;
  const Connection = classes.Connection;
  Application.prototype.connectToServer = function () {
    const adapter = this.adapters['MOCK'];
    const baseUrl = this.config.baseUrl;

    this.connection = new Connection({
      adapter,
      baseUrl
    });

    return this.connection.connect()
  };

  describe('#initialize', function(){
    // window.app = new Application({
    //   adapter: 'MOCK'
    // });
    it('should get the server definition from the server', function (done){

      done();
    });

    it('should connect to the server', function (done){

      done();
    });

    it('should instantiate model singletons', function (done){

      done();
    });

    it('should instantiate controller singletons', function (done){

      done();
    });

    it('should instantiate service singletons', function (done){

      done();
    });

    it('should instantiate request singletons', function (done){

      done();
    });

    it('should run bootstrap', function (done){

      done();
    });

    it('should interpret server files', function (done){

      done();
    });

    it('should interpret client files', function (done){

      done();
    });

    it('should instantiate the router', function (done){

      done();
    });

    it('should trigger an event when ready', function (done){

      done();
    });

  });
});
