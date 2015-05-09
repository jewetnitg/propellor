/**
 * Created by RikHoffbauer on 09/05/15.
 */

import _ from 'lodash';

const singletons = {};

class Model {

  constructor(options) {
    if (singletons[options.name]) {
      return singletons[options.name];
    } else {
      singletons[options.name] = this;
    }

    _.extend(this, options);

    this.data = [];
    app.data[this.name] = this.data;
    //this.makeRequestWrapperFunctions();
  }

}

export default Model;
