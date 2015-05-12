/**
 * Created by RikHoffbauer on 11/05/15.
 */

import _ from 'lodash';

const singletons = {};

class Controller {

  constructor (options) {
    if (singletons[options.entity]) {
      return singletons[options.entity];
    } else {
      singletons[options.entity] = this;
    }

    _.extend(this, options);

  }

}

export default Controller
