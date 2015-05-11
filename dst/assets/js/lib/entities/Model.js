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

    // expose the model's data on app.data so it's easily accessible
    app.data[this.name] = this.data;
  }

}

export default Model;
