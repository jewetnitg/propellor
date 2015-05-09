'use strict';

import _      from 'lodash';
import $      from 'jquery';
import files  from './files'

if (window) {
  window._ = _;
  window.$ = $;
  window.files = files;
}

$(function () {
  $('body').text('Hello World :) !!');
});
