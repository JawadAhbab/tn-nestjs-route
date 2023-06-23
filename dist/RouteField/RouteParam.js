'use strict';

var ptypes = ['string', 'number', 'boolean'];
var RouteParam = function RouteParam(opts, v) {
  return function (target, name) {
    var _opts$type;
    var optional = (opts === null || opts === void 0 ? void 0 : opts.optional) || false;
    var typename = (opts === null || opts === void 0 ? void 0 : (_opts$type = opts.type) === null || _opts$type === void 0 ? void 0 : _opts$type.name) || Reflect.getMetadata('design:type', target, name).name;
    var type = typename.toLowerCase();
    if (!ptypes.includes(type)) throw new Error("@RouteParam(".concat(name, ") must be typeof ").concat(ptypes, "\n"));
    var validator = v || function () {
      return true;
    };
    var getter = function getter() {
      return {
        $param: true,
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
exports.RouteParam = RouteParam;
