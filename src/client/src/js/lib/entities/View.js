/**
 * Created by RikHoffbauer on 11/05/15.
 */
"use strict";

import _ from 'lodash';
import Backbone from 'backbone';

/**
 * The View class, this is the entity that should be used to do DOM stuff,
 * it's only ever called from another View, when using it as a subView.
 *
 * Or by the router when executing a route
 *
 * the model will be available under this.Model
 *
 */
class View {

  constructor(options) {
    _.extend(this, this.constructor.instanceProperties(), options);

    this.options = options;
    this.attributes = options.attributes;

    _.bindAll(this, '__bindDataEventListener');

    if (!this.holder) throw new Error("Can't construct view, no holder specified");
    if (!this.name) throw new Error("Can't construct view, no name specified");

    this.__ensurePolymerComponent();
    this.__render();
  }

  /**
   * Gets the relative path the the Polymer component index.html file
   * @returns {string}
   */
  get polymerComponentPath() {
    return this.absolutePathToPolymerComponentRoot + this.name + '/' + this.name + '.html';
  }

  /**
   * Ensures the Polymer component is imported
   * @private
   */
  __ensurePolymerComponent() {
    if (!$("link[rel='import'][href='" + this.polymerComponentPath + "']").length) {
      const el = $('<link rel="import" href="' + this.polymerComponentPath + '" />');
      el.appendTo($("head"));
      el.on('load', () => {
        this.trigger('ready');
      });
    } else {
      this.alternativeElementInitialization = true;
      this.trigger('ready');
    }
  }

  /**
   * private render function, makes this.$el,
   * calls user defined render method
   * appends this.$el to this.holder
   * @private
   */
  __render() {
    this.__makeEl();

    if (this.render) {
      this.render();
    }

    this.__appendElToHolder();
    this.on('ready', () => {
      this.__bindEventListeners();
    });
  }

  /**
   * Binds DOM event listeners specified in this.events
   * @private
   */
  __bindEventListeners() {
    for (var eventString in this.events) {
      const firstSpaceIndex = eventString.indexOf(" ");
      const eventHandler = this.events[eventString];

      let selector;
      let event;

      // there is no space in the eventString if it looks something like 'click' instead of 'click #elem'
      if (firstSpaceIndex === -1) {
        event = eventString;
        selector = this.el;
      } else {
        event = eventString.substring(0, firstSpaceIndex);
        selector = eventString.substring(firstSpaceIndex + 1);
        selector = $(selector, this.el);
      }

      $(selector).on(event, (ev, data) => {
        this[eventHandler](data);
      });
    }
  }

  /**
   * Appends this.$el to this.holder
   * @private
   */
  __appendElToHolder() {
    const holder = $(this.holder);

    if (this.clearHolder) {
      holder.empty();
    }

    this.$el.appendTo(holder);
    this.el = this.$el[0];
    this.__bindDataEventListeners();
    this.__addReferenceToViewOnWebComponent();
  }

  /**
   * Makes this.$el using this.name,
   * some funky logic is in here, having to do with a polymer component being already available,
   * for some reason it's instantiated when ran in jQuery, whereas on first load it's not, even though it's async.
   * what it does in the case of a second append of this view is apply all attributes to a temp $element in memory
   * convert it to a string, replace the open and closing tags with the correct tag name, and then continue as normal
   * @private
   */
  __makeEl() {
    const tag = this.name;
    if (this.alternativeElementInitialization ) {
      this.$el = $('<internal-tmp-el></internal-tmp-el>');
      this.__addAttributesToEl();
      let html = this.$el[0].outerHTML;
      html = html.replace(/^<internal-tmp-el/g, '<' + tag).replace(/$<\/internal-tmp-el>/g, '</' + tag + '>');
      this.$el = $(html);
    } else {
      this.$el = $('<' + tag + '></' + tag + '>');
      this.__addAttributesToEl();
    }
  }

  /**
   * Adds a reference to the instance of the view to the webcomponent under
   * this.View
   * @private
   */
  __addReferenceToViewOnWebComponent() {
    this.el.View = this;
  }

  /**
   * Uses a ObjectObserver to observe changes on this.attributes,
   * triggers 'datachange' when a change of any sort occurs
   * @private
   */
  __bindDataEventListeners() {
    Object.observe(this.attributes, (changes) => {
      this.trigger('datachange', this.attributes);
      this.$el.trigger('datachange', this.attributes);
    });

    _.each(this.attributes, this.__bindDataEventListener);
  }

  /**
   * binds to the Backbone.Events 'datachange' event for all models,
   * uses object observe to observe other changes in this.attributes
   * @param obj
   * @param objKey
   * @private
   */
  __bindDataEventListener(obj, objKey) {
   if (typeof obj === "object") {
      Object.observe(obj, (changes) => {
        this.trigger('datachange', this.attributes);
        this.$el.trigger('datachange', this.attributes);
      });
    }
  }


  /**
   * Sets this.attributes as HTML attributes on this.$el
   * @private
   */
  __addAttributesToEl() {
    for (var key in this.attributes) {
      var value = this.attributes[key];
      value = typeof value === "object" ? JSON.stringify(value) : value;

      this.$el.attr(key, value);
    }
  }

  /**
   * removes this.$el from the DOM
   */
  remove() {
    this.el.View = undefined;
    this.$el.replaceWith("");
    this.$el.remove();
    delete this.el;

    this.trigger('destroyed');
    this.stopListening();

    this.trigger = () => {}; /* noop trigger */
  }

}

View.prototype.clearHolder  = true;
View.prototype.absolutePathToPolymerComponentRoot = 'js/api/webcomponents/';
_.extend(View.prototype, Backbone.Events);

export default View;
