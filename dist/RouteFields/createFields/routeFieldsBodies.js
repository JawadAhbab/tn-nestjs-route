'use strict';

var common = require('@nestjs/common');
var tnValidate = require('tn-validate');
var bodyerr = function bodyerr(name) {
  return new common.BadRequestException("Invalid body: ".concat(name));
};
var routeFieldsBodies = function routeFieldsBodies(fields, body, route) {
  var typecorrection = !!route.files.length;
  route.bodies.forEach(function (_ref) {
    var name = _ref.name,
      type = _ref.type,
      optional = _ref.optional,
      validator = _ref.validator;
    var prevalue = body[name];
    var voidvalue = prevalue === undefined || prevalue === null;
    if (!optional && voidvalue) throw bodyerr(name);
    if (voidvalue) return;
    var value = prevalue;
    if (typecorrection) {
      if (type === 'boolean') {
        if (prevalue === 'true') value = true;else if (prevalue === 'false') value = false;else throw bodyerr(name);
      } else if (type === 'number') {
        value = +prevalue;
        if (isNaN(value)) throw bodyerr(name);
      }
    }
    if (type === 'string' && !tnValidate.isString(value)) throw bodyerr(name);
    if (type === 'number' && !tnValidate.isNumber(value)) throw bodyerr(name);
    if (type === 'boolean' && !tnValidate.isBoolean(value)) throw bodyerr(name);
    if (type === 'string[]' && !tnValidate.isStrArr(value)) throw bodyerr(name);
    if (type === 'number[]' && !tnValidate.isNumArr(value)) throw bodyerr(name);
    if (type === 'boolean[]' && !tnValidate.isBoolArr(value)) throw bodyerr(name);
    if (type === 'any[]' && !tnValidate.isArray(value)) throw bodyerr(name);
    if (type === 'object' && !tnValidate.isObject(value)) throw bodyerr(name);
    if (!validator(value)) throw bodyerr(name);
    fields[name] = value;
  });
};
exports.routeFieldsBodies = routeFieldsBodies;
