# Object.assign (IE)
`if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}`

# Set (IE)
window.Set = require 'es6-set';

# Array.from (IE)
if not Array.from then Array.from = require('array-from')

# Promise (IE)
if not window.Promise    then window.Promise = require 'promise-polyfill'

# Smooth scrollTo (non-FF)
require('smoothscroll-polyfill').polyfill()