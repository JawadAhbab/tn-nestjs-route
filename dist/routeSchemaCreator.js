'use strict';

var tnValidate = require('tn-validate');
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
exports.routeSchemaCreator = routeSchemaCreator;
