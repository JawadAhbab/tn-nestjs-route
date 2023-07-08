'use strict';

var _slicedToArray = require("@babel/runtime/helpers/slicedToArray");
var _toConsumableArray = require("@babel/runtime/helpers/toConsumableArray");
var tnValidate = require('tn-validate');
var common = require('@nestjs/common');
var core = require('@nestjs/core');
var sha = require('crypto-js/sha256');
var ms = require('ms');
var platformExpress = require('@nestjs/platform-express');
var Route = function Route(routebase, cdnconfig) {
  return function (target) {
    var routecdnconfig = {
      bunnycdn: (cdnconfig === null || cdnconfig === void 0 ? void 0 : cdnconfig.bunnycdn) || (cdnconfig === null || cdnconfig === void 0 ? void 0 : cdnconfig.bunnyperma) || (cdnconfig === null || cdnconfig === void 0 ? void 0 : cdnconfig.bunnysecure) || false,
      bunnyperma: (cdnconfig === null || cdnconfig === void 0 ? void 0 : cdnconfig.bunnyperma) || false,
      bunnysecure: (cdnconfig === null || cdnconfig === void 0 ? void 0 : cdnconfig.bunnysecure) || false
    };
    target.prototype.$routebase = routebase;
    target.prototype.$routecdnconfig = routecdnconfig;
  };
};
var getAllProperties = function getAllProperties(cls) {
  var properties = [];
  if (cls.prototype) properties.push.apply(properties, _toConsumableArray(Object.getOwnPropertyNames(cls.prototype)));
  var extend = Object.getPrototypeOf(cls);
  if (extend) properties.push.apply(properties, _toConsumableArray(getAllProperties(extend)));
  return properties;
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
        getAllProperties(expcls).forEach(function (p) {
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
    var getter = (opts === null || opts === void 0 ? void 0 : opts.getter) || function (v) {
      return v;
    };
    var get = function get() {
      return {
        $body: true,
        name: name,
        type: type,
        optional: optional,
        object: object,
        selects: (opts === null || opts === void 0 ? void 0 : opts.selects) || null,
        getter: getter,
        validator: validator
      };
    };
    Object.defineProperty(target, name, {
      get: get
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
        validators: validators,
        selects: null
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
    var getter = (opts === null || opts === void 0 ? void 0 : opts.getter) || function (v) {
      return v;
    };
    var get = function get() {
      return {
        $param: true,
        name: name,
        type: type,
        optional: optional,
        selects: (opts === null || opts === void 0 ? void 0 : opts.selects) || null,
        validator: validator,
        getter: getter
      };
    };
    Object.defineProperty(target, name, {
      get: get
    });
  };
};
var RouteIndexParam = function RouteIndexParam(index, opts, v) {
  return function (target, name) {
    var _opts$type2;
    var optional = (opts === null || opts === void 0 ? void 0 : opts.optional) || false;
    var typename = (opts === null || opts === void 0 ? void 0 : (_opts$type2 = opts.type) === null || _opts$type2 === void 0 ? void 0 : _opts$type2.name) || Reflect.getMetadata('design:type', target, name).name;
    var type = typename.toLowerCase();
    if (!ptypes.includes(type)) throw new Error("@RouteIndexParam(".concat(name, ") must be typeof ").concat(ptypes, "\n")); // prettier-ignore
    var validator = v || function () {
      return true;
    };
    var getter = (opts === null || opts === void 0 ? void 0 : opts.getter) || function (v) {
      return v;
    };
    var get = function get() {
      return {
        $param: true,
        index: index,
        name: name,
        type: type,
        optional: optional,
        selects: (opts === null || opts === void 0 ? void 0 : opts.selects) || null,
        validator: validator,
        getter: getter
      };
    };
    Object.defineProperty(target, name, {
      get: get
    });
  };
};
var qtypes = ['string', 'number', 'boolean'];
var RouteQuery = function RouteQuery(opts, v) {
  return function (target, name) {
    var _opts$type3;
    var optional = (opts === null || opts === void 0 ? void 0 : opts.optional) || false;
    var typename = (opts === null || opts === void 0 ? void 0 : (_opts$type3 = opts.type) === null || _opts$type3 === void 0 ? void 0 : _opts$type3.name) || Reflect.getMetadata('design:type', target, name).name;
    var type = typename.toLowerCase();
    if (!qtypes.includes(type)) throw new Error("@RouteQuery(".concat(name, ") must be typeof ").concat(qtypes, "\n"));
    var validator = v || function () {
      return true;
    };
    var getter = (opts === null || opts === void 0 ? void 0 : opts.getter) || function (v) {
      return v;
    };
    var get = function get() {
      return {
        $query: true,
        name: name,
        type: type,
        optional: optional,
        selects: (opts === null || opts === void 0 ? void 0 : opts.selects) || null,
        validator: validator,
        getter: getter
      };
    };
    Object.defineProperty(target, name, {
      get: get
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
        getAllProperties(expcls).forEach(function (p) {
          var value = expcls.prototype[p];
          if (value.$result) object.push(value);
        });
      }
    }
    var type = typename.toLowerCase();
    if (!rtypes.includes(type)) throw new Error("@RouteResult(".concat(name, ") must be typeof ").concat(rtypes, "\n"));
    var get = function get() {
      return {
        $result: true,
        name: name,
        type: type,
        optional: optional,
        object: object,
        selects: (opts === null || opts === void 0 ? void 0 : opts.selects) || null
      };
    };
    Object.defineProperty(target, name, {
      get: get
    });
  };
};
var RouteSecure = function RouteSecure(secret, opts) {
  return function (target, name) {
    var get = function get() {
      return {
        $secure: true,
        name: name,
        secret: secret,
        timesafe: (opts === null || opts === void 0 ? void 0 : opts.timesafe) || false,
        query: (opts === null || opts === void 0 ? void 0 : opts.query) || false
      };
    };
    Object.defineProperty(target, name, {
      get: get
    });
  };
};
var routeFieldsEssentials = function routeFieldsEssentials(ctx) {
  var req = ctx.switchToHttp().getRequest();
  var _req$params = req.params,
    params = _req$params === void 0 ? {} : _req$params,
    _req$body = req.body,
    body = _req$body === void 0 ? {} : _req$body,
    _req$files = req.files,
    files = _req$files === void 0 ? {} : _req$files,
    _req$query = req.query,
    query = _req$query === void 0 ? {} : _req$query;
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
    query: query,
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
    selects = bodyinfo.selects,
    validator = bodyinfo.validator,
    getter = bodyinfo.getter;
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
  if (selects && !selects.includes(value)) throw bodyerr(name);
  if (!validator(value)) throw bodyerr(name, prefix);
  if (type !== 'object' && type !== 'object[]') return getter(value);
  var arr = type === 'object[]';
  var arrvalue = arr ? value : [value];
  var retvalue = arrvalue.map(function (values) {
    var value = {};
    object.forEach(function (nextbodyinfo) {
      var nextname = nextbodyinfo.name;
      var nextvalue = values[nextname];
      value[nextname] = getValue(nextbodyinfo, nextvalue, [].concat(_toConsumableArray(prefix), [name]));
    });
    return getter(value);
  });
  return getter(arr ? retvalue : retvalue[0]);
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
      selects = _ref2.selects,
      validator = _ref2.validator,
      getter = _ref2.getter;
    var value;
    var strval = params[name];
    if (optional && strval === '-') return;else if (type === 'string') value = strval;else if (type === 'boolean') {
      if (strval === 'true') value = true;else if (strval === 'false') value = false;else throw paramerr(name);
    } else {
      value = +strval;
      if (isNaN(value)) throw paramerr(name);
    }
    if (selects && !selects.includes(value)) throw paramerr(name);
    if (!validator(value)) throw paramerr(name);
    fields[name] = getter(value);
  });
};
var queryerr = function queryerr(name) {
  return new common.BadRequestException("Invalid query: ".concat(name));
};
var routeFieldsQueries = function routeFieldsQueries(fields, query, route) {
  route.queries.forEach(function (_ref3) {
    var name = _ref3.name,
      type = _ref3.type,
      optional = _ref3.optional,
      selects = _ref3.selects,
      validator = _ref3.validator,
      getter = _ref3.getter;
    var value;
    var strval = query[name];
    if (optional && strval === '-') return;else if (type === 'string') value = strval;else if (type === 'boolean') {
      if (strval === 'true') value = true;else if (strval === 'false') value = false;else throw queryerr(name);
    } else {
      value = +strval;
      if (isNaN(value)) throw queryerr(name);
    }
    if (selects && !selects.includes(value)) throw queryerr(name);
    if (!validator(value)) throw queryerr(name);
    fields[name] = getter(value);
  });
};
var routeFieldsSecure = function routeFieldsSecure(query, params, route) {
  var rs = route.routesecure;
  if (!rs) return;
  var token = rs.query ? query[rs.name] : params[rs.name];
  if (!token) throw new common.UnauthorizedException();
  var paramurl = route.params.map(function (_ref4) {
    var name = _ref4.name;
    return params[name];
  }).join('/');
  var secret = route.getRouteSecureSecret();
  if (rs.timesafe) {
    var _token$split = token.split('.'),
      _token$split2 = _slicedToArray(_token$split, 2),
      expstr = _token$split2[0],
      hash = _token$split2[1];
    var remain = +expstr - new Date().getTime();
    if (remain <= 0 || remain >= ms(rs.timesafe)) throw new common.UnauthorizedException();
    var hashmatch = sha(paramurl + expstr + secret).toString();
    if (hash !== hashmatch) throw new common.UnauthorizedException();
  } else {
    var _hashmatch = sha(paramurl + secret).toString();
    if (token !== _hashmatch) throw new common.UnauthorizedException();
  }
};
var RouteFields = common.createParamDecorator(function (_, ctx) {
  var _routeFieldsEssential = routeFieldsEssentials(ctx),
    params = _routeFieldsEssential.params,
    body = _routeFieldsEssential.body,
    query = _routeFieldsEssential.query,
    files = _routeFieldsEssential.files,
    route = _routeFieldsEssential.route;
  var fields = {};
  routeFieldsSecure(query, params, route);
  routeFieldsParams(fields, params, route);
  routeFieldsQueries(fields, query, route);
  routeFieldsBodies(fields, body, route);
  routeFieldsFiles(fields, files, route);
  return fields;
});
var createRouteInfo = function createRouteInfo(method, routecls, resultcls) {
  var paramsUnindexed = [];
  var paramsIndexed = [];
  var queries = [];
  var bodies = [];
  var files = [];
  var paramnames = [];
  var rs;
  getAllProperties(routecls).forEach(function (p) {
    var body = routecls.prototype[p];
    if (body.$body) return bodies.push(body);
    var secure = body;
    if (secure.$secure) return rs = secure;
    var query = body;
    if (query.$query) return queries.push(query);
    var file = body;
    if (file.$file) return files.push(file);
    var param = body;
    if (!param.$param) return;
    if (param.index) paramsIndexed.splice(param.index, 0, param);else paramsUnindexed.push(param);
    paramnames.push(p);
  });
  var results = 'String';
  if ((resultcls === null || resultcls === void 0 ? void 0 : resultcls.name) === 'String') results = 'String';else if ((resultcls === null || resultcls === void 0 ? void 0 : resultcls.name) === 'Buffer') results = 'Buffer';else if (resultcls) {
    var resjson = [];
    getAllProperties(resultcls).forEach(function (p) {
      var result = resultcls.prototype[p];
      if (result.$result) return resjson.push(result);
    });
    results = resjson;
  }
  var cdnconfig = routecls.prototype.$routecdnconfig;
  var base = routecls.prototype.$routebase;
  if (cdnconfig.bunnysecure) base = '/-secure-/' + base;
  if (cdnconfig.bunnyperma) base = '/-perma-/' + base;
  var routearr = [base].concat(_toConsumableArray(paramnames.map(function (n) {
    return ":".concat(n);
  })));
  if (rs && !rs.query) routearr.push(":".concat(rs.name));
  return {
    $route: true,
    route: routearr.join('/').replace(/[\\\/]+/g, '/'),
    method: method,
    name: routecls.name,
    routesecure: !rs ? false : {
      name: rs.name,
      timesafe: rs.timesafe,
      query: rs.query
    },
    cdnconfig: cdnconfig,
    queries: queries,
    params: [].concat(paramsUnindexed, paramsIndexed),
    bodies: bodies,
    files: files,
    results: results,
    getRouteSecureSecret: function getRouteSecureSecret() {
      var _rs;
      return (_rs = rs) === null || _rs === void 0 ? void 0 : _rs.secret;
    }
  };
};
var RouteGet = function RouteGet(routecls, resultcls) {
  return createDecor('GET', routecls, resultcls);
}; // prettier-ignore
var RoutePost = function RoutePost(routecls, resultcls) {
  return createDecor('POST', routecls, resultcls);
}; // prettier-ignore
var createDecor = function createDecor(method, routecls, resultcls) {
  var routeinfo = createRouteInfo(method, routecls, resultcls);
  var route = routeinfo.route;
  var routeDecor = function routeDecor(target) {
    if (!tnValidate.isArray(target.$routes)) target.$routes = [];
    target.$routes.push(routeinfo);
  };
  var Method = method === 'GET' ? common.Get : common.Post;
  var decors = [routeDecor, Method(route)];
  if (routeinfo.files.length) {
    var multer = routeinfo.files.map(function (file) {
      return {
        name: file.name
      };
    });
    decors.push(common.UseInterceptors(platformExpress.FileFieldsInterceptor(multer)));
    var acc = ['string', 'number', 'boolean'];
    routeinfo.bodies.forEach(function (_ref5) {
      var type = _ref5.type,
        name = _ref5.name;
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
exports.RouteIndexParam = RouteIndexParam;
exports.RouteParam = RouteParam;
exports.RoutePost = RoutePost;
exports.RouteQuery = RouteQuery;
exports.RouteResult = RouteResult;
exports.RouteSecure = RouteSecure;
exports.createRouteInfo = createRouteInfo;
exports.routeSchemaCreator = routeSchemaCreator;
