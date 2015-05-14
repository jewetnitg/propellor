'use strict';

import _            from 'lodash';
import $            from 'jquery';
import files        from './files';
import Application  from './entities/Application';

const context = window || global || {};

context._ = _;
context.$ = $;
context.files = files;

context.app = new Application();
