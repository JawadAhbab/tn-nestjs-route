'use strict';

var tnValidate = require('tn-validate');
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
exports.RouteFile = RouteFile;
