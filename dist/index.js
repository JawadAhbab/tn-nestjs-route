'use strict';

var _toConsumableArray = require("@babel/runtime/helpers/toConsumableArray");
var tnValidate = require('tn-validate');
var common = require('@nestjs/common');
var core = require('@nestjs/core');
var platformExpress = require('@nestjs/platform-express');
var Route = function Route(routebase) {
  return function (target) {
    target.prototype.$routebase = routebase;
  };
};
var btypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'object[]', 'any[]']; // prettier-ignore
var RouteBody = function RouteBody(opts, v) {
  return function (target, name) {
    var optional = (opts === null || opts === void 0 ? void 0 : opts.optional) || false;
    var typename = '';
    var object = [];
    var explicit = opts === null || opts === void 0 ? void 0 : opts.type;
    if (!explicit) typename = Reflect.getMetadata('design:type', target, name).name;else {
      var arr = tnValidate.isArray(explicit);
      var expname = (arr ? explicit[0].name : explicit.name).toLowerCase();
      if (expname === 'array') typename = 'any[]';else if (btypes.includes(expname)) typename = arr ? "".concat(expname, "[]") : expname;else {
        var expcls = arr ? explicit[0] : explicit;
        typename = arr ? 'object[]' : 'object';
        Object.getOwnPropertyNames(expcls.prototype).forEach(function (p) {
          var value = expcls.prototype[p];
          if (value.$body) object.push(value);
        });
      }
    }
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
        object: object,
        validator: validator
      };
    };
    Object.defineProperty(target, name, {
      get: getter
    });
  };
};
var RouteFile = function RouteFile(opts) {
  return function (target, name) {
    var _opts$maxsize;
    var optional = (opts === null || opts === void 0 ? void 0 : opts.optional) || false;
    var typename = Reflect.getMetadata('design:type', target, name).name;
    var type = typename === 'Array' ? 'file[]' : 'file';
    var limit = type === 'file' ? 1 : (opts === null || opts === void 0 ? void 0 : opts.limit) || 20;
    var msstr = (opts === null || opts === void 0 ? void 0 : (_opts$maxsize = opts.maxsize) === null || _opts$maxsize === void 0 ? void 0 : _opts$maxsize.toString()) || '50M';
    var mscount = parseFloat(msstr);
    var maxsize = msstr.endsWith('G') ? mscount * 1000000000 : msstr.endsWith('M') ? mscount * 1000000 : msstr.endsWith('K') ? mscount * 1000 : mscount;
    var mimetype = (opts === null || opts === void 0 ? void 0 : opts.mimetype) || null;
    var mimetypes = !mimetype ? null : tnValidate.isArray(mimetype) ? mimetype : [mimetype];
    var validators = {
      maxsize: maxsize,
      limit: limit,
      mimetypes: mimetypes
    };
    var getter = function getter() {
      return {
        $file: true,
        name: name,
        type: type,
        optional: optional,
        validators: validators
      };
    };
    Object.defineProperty(target, name, {
      get: getter
    });
  };
};
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
var rtypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'object[]', 'any[]']; // prettier-ignore
var RouteResult = function RouteResult(opts) {
  return function (target, name) {
    var optional = (opts === null || opts === void 0 ? void 0 : opts.optional) || false;
    var typename = '';
    var object = [];
    var explicit = opts === null || opts === void 0 ? void 0 : opts.type;
    if (!explicit) typename = Reflect.getMetadata('design:type', target, name).name;else {
      var arr = tnValidate.isArray(explicit);
      var expname = (arr ? explicit[0].name : explicit.name).toLowerCase();
      if (expname === 'array') typename = 'any[]';else if (rtypes.includes(expname)) typename = arr ? "".concat(expname, "[]") : expname;else {
        var expcls = arr ? explicit[0] : explicit;
        typename = arr ? 'object[]' : 'object';
        Object.getOwnPropertyNames(expcls.prototype).forEach(function (p) {
          var value = expcls.prototype[p];
          if (value.$result) object.push(value);
        });
      }
    }
    var type = typename.toLowerCase();
    if (!rtypes.includes(type)) throw new Error("@RouteResult(".concat(name, ") must be typeof ").concat(rtypes, "\n"));
    var getter = function getter() {
      return {
        $result: true,
        name: name,
        type: type,
        optional: optional,
        object: object
      };
    };
    Object.defineProperty(target, name, {
      get: getter
    });
  };
};
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
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var prestr = prefix.map(function (p) {
    return "".concat(p, ".");
  }).join('');
  return new common.BadRequestException("Invalid body: ".concat(prestr).concat(name));
};
var routeFieldsBodies = function routeFieldsBodies(fields, body, route) {
  var typecorrection = !!route.files.length;
  route.bodies.forEach(function (bodyinfo) {
    var name = bodyinfo.name,
      type = bodyinfo.type;
    var prevalue = body[name];
    var voidvalue = prevalue === undefined || prevalue === null;
    var value = prevalue;
    if (typecorrection && !voidvalue) {
      if (type === 'boolean') {
        if (prevalue === 'true') value = true;else if (prevalue === 'false') value = false;else throw bodyerr(name);
      } else if (type === 'number') {
        value = +prevalue;
        if (isNaN(value)) throw bodyerr(name);
      }
    }
    fields[name] = getValue(bodyinfo, value);
  });
};
var getValue = function getValue(bodyinfo, value) {
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var name = bodyinfo.name,
    optional = bodyinfo.optional,
    type = bodyinfo.type,
    object = bodyinfo.object,
    validator = bodyinfo.validator;
  var voidvalue = value === undefined || value === null;
  if (!optional && voidvalue) throw bodyerr(name, prefix);
  if (voidvalue) return;
  if (type === 'string' && !tnValidate.isString(value)) throw bodyerr(name, prefix);
  if (type === 'number' && !tnValidate.isNumber(value)) throw bodyerr(name, prefix);
  if (type === 'boolean' && !tnValidate.isBoolean(value)) throw bodyerr(name, prefix);
  if (type === 'string[]' && !tnValidate.isStrArr(value)) throw bodyerr(name, prefix);
  if (type === 'number[]' && !tnValidate.isNumArr(value)) throw bodyerr(name, prefix);
  if (type === 'boolean[]' && !tnValidate.isBoolArr(value)) throw bodyerr(name, prefix);
  if (type === 'any[]' && !tnValidate.isArray(value)) throw bodyerr(name, prefix);
  if (type === 'object[]' && !tnValidate.isArray(value)) throw bodyerr(name, prefix);
  if (type === 'object' && !tnValidate.isObject(value)) throw bodyerr(name, prefix);
  if (!validator(value)) throw bodyerr(name, prefix);
  if (type !== 'object' && type !== 'object[]') return value;
  var arr = type === 'object[]';
  var arrvalue = arr ? value : [value];
  var retvalue = arrvalue.map(function (values) {
    var value = {};
    object.forEach(function (nextbodyinfo) {
      var nextname = nextbodyinfo.name;
      var nextvalue = values[nextname];
      value[nextname] = getValue(nextbodyinfo, nextvalue, [].concat(_toConsumableArray(prefix), [name]));
    });
    return value;
  });
  return arr ? retvalue : retvalue[0];
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
  route.files.forEach(function (_ref) {
    var name = _ref.name,
      optional = _ref.optional,
      type = _ref.type,
      validators = _ref.validators;
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
  route.params.forEach(function (_ref2) {
    var name = _ref2.name,
      type = _ref2.type,
      optional = _ref2.optional,
      validator = _ref2.validator;
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
var createRouteInfo = function createRouteInfo(routecls, resultcls) {
  var base = routecls.prototype.$routebase;
  var name = routecls.name;
  var params = [];
  var bodies = [];
  var files = [];
  var results = [];
  var paramnames = [];
  Object.getOwnPropertyNames(routecls.prototype).forEach(function (p) {
    var body = routecls.prototype[p];
    if (body.$body) return bodies.push(body);
    var file = body;
    if (file.$file) return files.push(file);
    var param = body;
    if (!param.$param) return;
    params.push(param);
    paramnames.push(p);
  });
  if (resultcls) {
    Object.getOwnPropertyNames(resultcls.prototype).forEach(function (p) {
      var result = resultcls.prototype[p];
      if (result.$result) return results.push(result);
    });
  }
  var route = [base].concat(_toConsumableArray(paramnames.map(function (n) {
    return ":".concat(n);
  }))).join('/').replace(/[ \s]+/g, '').replace(/[\\\/]+/g, '/');
  return {
    $route: true,
    name: name,
    route: route,
    params: params,
    bodies: bodies,
    files: files,
    results: results
  };
};
var RouteGet = function RouteGet(routecls, resultcls) {
  return createDecor(common.Get, routecls, resultcls);
}; // prettier-ignore
var RoutePost = function RoutePost(routecls, resultcls) {
  return createDecor(common.Post, routecls, resultcls);
}; // prettier-ignore
var createDecor = function createDecor(Method, routecls, resultcls) {
  var routeinfo = createRouteInfo(routecls, resultcls);
  var route = routeinfo.route;
  var routeDecor = function routeDecor(target) {
    if (!tnValidate.isArray(target.$routes)) target.$routes = [];
    target.$routes.push(routeinfo);
  };
  var decors = [routeDecor, Method(route)];
  if (routeinfo.files.length) {
    var multer = routeinfo.files.map(function (file) {
      return {
        name: file.name
      };
    });
    decors.push(common.UseInterceptors(platformExpress.FileFieldsInterceptor(multer)));
    var acc = ['string', 'number', 'boolean'];
    routeinfo.bodies.forEach(function (_ref3) {
      var type = _ref3.type,
        name = _ref3.name;
      if (acc.includes(type)) return;
      throw new Error("You are using @RouteFile() so @RouteBody(".concat(name, ") must be typeof ").concat(acc, "\n"));
    });
  }
  return common.applyDecorators.apply(common, decors);
};
var routeSchemaCreator = function routeSchemaCreator(controllers) {
  return controllers.map(function (controller) {
    var routes = controller.prototype.$routes;
    if (tnValidate.isArray(routes)) return routes.filter(function (r) {
      return r.$route;
    });
  }).filter(function (i) {
    return i;
  }).flat();
};
exports.Route = Route;
exports.RouteBody = RouteBody;
exports.RouteFields = RouteFields;
exports.RouteFile = RouteFile;
exports.RouteGet = RouteGet;
exports.RouteParam = RouteParam;
exports.RoutePost = RoutePost;
exports.RouteResult = RouteResult;
exports.createRouteInfo = createRouteInfo;
exports.routeSchemaCreator = routeSchemaCreator;
