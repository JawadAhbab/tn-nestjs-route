'use strict';

var Route = function Route(routebase) {
  return function (target) {
    target.prototype.$routebase = routebase;
  };
};
exports.Route = Route;
