/**
 * Created by RikHoffbauer on 19/05/15.
 */
'use strict';

import _            from 'lodash';
import $            from 'jquery';

import files        from './files';

import Application  from '../../dst/js/lib/entities/Application';
import Model        from '../../dst/js/lib/entities/Model';
import Service      from '../../dst/js/lib/entities/Service';
import Controller   from '../../dst/js/lib/entities/Controller';
import Adapter      from '../../dst/js/lib/entities/Adapter';
import Connection   from '../../dst/js/lib/entities/Connection';
import Request      from '../../dst/js/lib/entities/Request';
import Route        from '../../dst/js/lib/entities/Route';
import Router       from '../../dst/js/lib/entities/Router';
import Subset       from '../../dst/js/lib/entities/Subset';
import View         from '../../dst/js/lib/entities/View';

window._ = _;
window.$ = $;
window.files = files;

window.mockServer = true;

window.doServerRequest = function (options) {
  options = options || {};
  var method = options.method && options.method.toLowerCase() || 'get';
  var route = options.route;
  var dataKey = method + " " + route;
  console.log(dataKey, window.serverData);
  return window.serverData[dataKey];
};

window.$.get = function (url, data, cb) {
  if (data && typeof data === 'function') {
    cb = data;
    data = null;
  }

  var method;

  if (!data && !cb && typeof url === 'object') {
    cb = url.success;
    method = url.type || 'get';
    url = url.url;
  }
  if (cb) {
    cb(
      doServerRequest({
        method: method,
        route: url
      })
    );
  }
};

window.$.post = function (url, data, cb) {
  cb = cb || data;
  var method;

  if (!data && !cb && typeof url === 'object') {
    cb = url.success;
    method = url.type || 'post';
    url = url.url;
  }
  if (cb) {
    cb(doServerRequest({
      method: method,
      route: url
    }));
  }
};

window.classes = {
  Application,
  Model,
  Service,
  Controller,
  Adapter,
  Connection,
  Request,
  Route,
  Router,
  Subset,
  View
};
