/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

"use strict";

module.exports = {

  attributes: {

    firstName: {
      defaultsTo: "John"
    },

    lastName: {
      type: "string"
    },

    age: {
      type: "number",
      required: true
    }

  }

};