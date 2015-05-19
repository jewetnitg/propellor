// Sample test
var expect = chai.expect;

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function (done){
      var arr       = [1, 2, 3],
        indexOf5  = arr.indexOf(5),
        indexOf0  = arr.indexOf(0);

      expect(indexOf5).to.equal(-1, "index should be -1");
      expect(indexOf0).to.equal(-1, "index should be -1");

      done();
    });

    it('should return the index when the value is present', function (done){
      var arr       = [1, 2, 3],
          one       = 1,
          two       = 2,
          indexOf1  = arr.indexOf(one),
          indexOf2  = arr.indexOf(two);

      expect(indexOf1).to.not.equal(-1);
      expect(indexOf2).to.not.equal(-1);

      expect(arr[indexOf1]).to.equal(one, "index should be index of value");
      expect(arr[indexOf2]).to.equal(two, "index should be index of value");

      done();
    });

  });
});
