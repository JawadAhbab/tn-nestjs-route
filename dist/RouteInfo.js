'use strict';

var _toConsumableArray = require("@babel/runtime/helpers/toConsumableArray");
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
exports.createRouteInfo = createRouteInfo;
