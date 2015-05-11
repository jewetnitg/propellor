/**
 * Created by RikHoffbauer on 11/05/15.
 */

import _ from 'lodash';

class Connection {

  constructor(options) {
    _.extend(this, options);
    this.adapter = new this.adapter();
  }

  connect() {
    return new Promise((resolve, reject) => {
      console.log('connect');
      resolve();
    });
  }

}

export default Connection;
