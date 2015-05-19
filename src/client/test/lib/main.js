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

const context = window || global || {};

context._ = _;
context.$ = $;
context.files = files;

context.classes = {
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
