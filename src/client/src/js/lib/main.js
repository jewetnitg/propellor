'use strict';

import _                                          from 'lodash';
import $                                          from 'jquery';

if (window) {
  window._ = _;
  window.$ = $;
}

$(function () {
  $('body').text('Hello World :) !!');
});
