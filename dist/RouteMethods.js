'use strict';

var _toConsumableArray = require("@babel/runtime/helpers/toConsumableArray");
var common = require('@nestjs/common');
var platformExpress = require('@nestjs/platform-express');
var tnValidate = require('tn-validate');
var createRouteInfo = function createRouteInfo(routecls) {
  var base = routecls.prototype.$routebase;
  var params = [];
  var bodies = [];
  var files = [];
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
  var route = [base].concat(_toConsumableArray(paramnames.map(function (n) {
    return ":".concat(n);
  }))).join('/').replace(/[ \s]+/g, '').replace(/[\\\/]+/g, '/');
  return {
    $route: true,
    route: route,
    params: params,
    bodies: bodies,
    files: files
  };
};
var RouteGet = function RouteGet(routecls) {
  return createDecor(common.Get, routecls);
};
var RoutePost = function RoutePost(routecls) {
  return createDecor(common.Post, routecls);
};
var createDecor = function createDecor(Method, routecls) {
  var routeinfo = createRouteInfo(routecls);
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
    routeinfo.bodies.forEach(function (_ref) {
      var type = _ref.type,
        name = _ref.name;
      if (acc.includes(type)) return;
      throw new Error("You are using @RouteFile() so @RouteBody(".concat(name, ") must be typeof ").concat(acc, "\n"));
    });
  }
  return common.applyDecorators.apply(common, decors);
};
exports.RouteGet = RouteGet;
exports.RoutePost = RoutePost;
