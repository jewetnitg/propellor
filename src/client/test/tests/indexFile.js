// Sample test
var expect = chai.expect;

describe('File index file', function(){

  /**
   * CONFIG
   */
  describe('#config', function(){

    /**
     * BOOTSTRAP
     */
    describe('#bootstrap', function(){
      const bootstrap = files['config.bootstrap'];

      it('should be a function', function (done){
        expect(typeof bootstrap).to.equal("function", "bootstrap should be a function");
        done();
      });

      it('should resolve within 15 seconds', function (done){

        var postCb = function (resolved) {
          clearTimeout(timeOut);
          expect(resolved).to.equal(true, "bootstrap should resolve");
          done();
        };

        var resolve = function () {
          postCb(true);
        };

        var reject = function () {
          postCb(false);
        };

        var timeOut = setTimeout(function () {
          postCb(false);
        }, 15000);

        bootstrap(resolve, reject);
      });

    });

    /**
     * ROUTES
     */
    describe('#routes', function(){
      const routes = files['config.routes'];

      it('should be an object', function (done){
        expect(typeof routes).to.equal("object", "routes should be an object");
        done();
      });

    });

    /**
     * SUBSETS
     */
    describe('#subsets', function(){
      const subsets = files['config.subsets'];

      it('should be an object', function (done){
        expect(typeof subsets).to.equal("object", "subsets should be an object");
        done();
      });

    });

  });

});
