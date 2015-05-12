/**
 * Created by RikHoffbauer on 11/05/15.
 */

const singletons = {};

class Adapter {

  constructor(options) {
    if (singletons[options.name]) {
      return singletons[options.name];
    } else {
      singletons[options.name] = this;
    }

    this.connected = false;

    _.extend(this, options);
  }

  connect() {
    return new Promise(resolve => {
      this.connected = true;
      resolve();
    });
  }

  executeRequest() {
    console.warn('executeRequest method not implemented on ' + this.name + ' adapter');
  }

}

export default Adapter;
