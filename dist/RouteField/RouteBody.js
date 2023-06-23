'use strict';

var tnValidate = require('tn-validate');
var btypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'any[]']; // prettier-ignore
var RouteBody = function RouteBody(opts, v) {
  return function (target, name) {
    var optional = (opts === null || opts === void 0 ? void 0 : opts.optional) || false;
    var typename = '';
    var explicit = opts === null || opts === void 0 ? void 0 : opts.type;
    if (explicit) {
      if (tnValidate.isArray(explicit)) typename = "".concat(explicit[0].name, "[]");else typename = explicit.name === 'Array' ? 'any[]' : explicit.name;
    } else typename = Reflect.getMetadata('design:type', target, name).name;
    var type = typename.toLowerCase();
    if (!btypes.includes(type)) throw new Error("@RouteBody(".concat(name, ") must be typeof ").concat(btypes, "\n"));
    var validator = v || function () {
      return true;
    };
    var getter = function getter() {
      return {
        $body: true,
        name: name,
        type: type,
        optional: optional,
        validator: validator
      };
    };
    Object.defineProperty(target, name, {
      get: getter
    });
  };
};
exports.RouteBody = RouteBody;
