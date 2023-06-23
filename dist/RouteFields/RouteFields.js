'use strict';

var common = require('@nestjs/common');
var core = require('@nestjs/core');
var tnValidate = require('tn-validate');
var routeFieldsEssentials = function routeFieldsEssentials(ctx) {
  var _ctx$switchToHttp$get = ctx.switchToHttp().getRequest(),
    params = _ctx$switchToHttp$get.params,
    body = _ctx$switchToHttp$get.body,
    files = _ctx$switchToHttp$get.files;
  var reflector = new core.Reflector();
  var handler = ctx.getHandler();
  var path = reflector.get('path', handler);
  var controller = ctx.getClass();
  var routes = controller.prototype.$routes;
  if (!tnValidate.isArray(routes)) throw new common.InternalServerErrorException('@Route() setup has faults');
  var route = routes.find(function (route) {
    return route.$route && route.route === path;
  });
  if (!route) throw new common.InternalServerErrorException('@Route() setup has faults');
  return {
    params: params,
    body: body,
    files: files,
    route: route
  };
};
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
var fileerr = function fileerr(name) {
  return new common.BadRequestException("Invalid file: ".concat(name));
};
var validate = function validate(file, validators) {
  var maxsize = validators.maxsize,
    mimetypes = validators.mimetypes;
  if (file.size > maxsize) return false;
  if (!mimetypes) return true;
  return mimetypes.includes(file.mimetype);
};
var routeFieldsFiles = function routeFieldsFiles(fields, files, route) {
  route.files.forEach(function (_ref2) {
    var name = _ref2.name,
      optional = _ref2.optional,
      type = _ref2.type,
      validators = _ref2.validators;
    var multers = files[name];
    if (!optional && !multers) throw fileerr(name);
    if (!multers) return;
    if (type === 'file') {
      if (multers.length > 1) throw fileerr(name);
      var file = multers[0];
      if (!validate(file, validators)) throw fileerr(name);
      return fields[name] = file;
    }
    if (multers.length > validators.limit) throw fileerr(name);
    if (!multers.map(function (f) {
      return validate(f, validators);
    }).every(function (i) {
      return i;
    })) throw fileerr(name);
    fields[name] = multers;
  });
};
var paramerr = function paramerr(name) {
  return new common.BadRequestException("Invalid parameter: ".concat(name));
};
var routeFieldsParams = function routeFieldsParams(fields, params, route) {
  route.params.forEach(function (_ref3) {
    var name = _ref3.name,
      type = _ref3.type,
      optional = _ref3.optional,
      validator = _ref3.validator;
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
var RouteFields = common.createParamDecorator(function (_, ctx) {
  var _routeFieldsEssential = routeFieldsEssentials(ctx),
    params = _routeFieldsEssential.params,
    body = _routeFieldsEssential.body,
    files = _routeFieldsEssential.files,
    route = _routeFieldsEssential.route;
  var fields = {};
  routeFieldsParams(fields, params, route);
  routeFieldsBodies(fields, body, route);
  routeFieldsFiles(fields, files, route);
  return fields;
});
exports.RouteFields = RouteFields;
