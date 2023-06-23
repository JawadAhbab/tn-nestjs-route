'use strict';

var common = require('@nestjs/common');
var paramerr = function paramerr(name) {
  return new common.BadRequestException("Invalid parameter: ".concat(name));
};
var routeFieldsParams = function routeFieldsParams(fields, params, route) {
  route.params.forEach(function (_ref) {
    var name = _ref.name,
      type = _ref.type,
      optional = _ref.optional,
      validator = _ref.validator;
    var value;
    var strval = params[name];
    if (optional && strval === '-') return;else if (type === 'string') value = strval;else if (type === 'boolean') {
      if (strval === 'true') value = true;else if (strval === 'false') value = false;else throw paramerr(name);
    } else {
      value = +strval;
      if (isNaN(value)) throw paramerr(name);
    }
    if (!validator(value)) throw paramerr(name);
    fields[name] = value;
  });
};
exports.routeFieldsParams = routeFieldsParams;
