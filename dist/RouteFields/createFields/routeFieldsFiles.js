'use strict';

var common = require('@nestjs/common');
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
exports.routeFieldsFiles = routeFieldsFiles;
