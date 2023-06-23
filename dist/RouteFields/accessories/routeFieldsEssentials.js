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
exports.routeFieldsEssentials = routeFieldsEssentials;
