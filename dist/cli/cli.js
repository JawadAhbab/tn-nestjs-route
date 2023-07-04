#!/usr/bin/env node
'use strict';

var _regeneratorRuntime = require("@babel/runtime/regenerator");
var _asyncToGenerator = require("@babel/runtime/helpers/asyncToGenerator");
var _toConsumableArray = require("@babel/runtime/helpers/toConsumableArray");
var axios = require('axios');
var fs = require('fs-extra');
var path = require('path');
var tnValidate = require('tn-validate');
function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function get() {
            return e[k];
          }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}
var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
var templateInterfaces = "\nconst qtypes = ['string', 'number', 'boolean'] as const\nconst ptypes = ['string', 'number', 'boolean'] as const\nconst btypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'object[]', 'any[]'] as const // prettier-ignore\nconst rtypes = ['string', 'number', 'boolean', 'object', 'string[]', 'number[]', 'boolean[]', 'object[]', 'any[]'] as const // prettier-ignore\nconst filetypes = ['file', 'file[]'] as const\ntype RouteMethod = 'GET' | 'POST'\ntype FileType = (typeof filetypes)[number]\ntype QueryType = (typeof qtypes)[number]\ntype ParamType = (typeof ptypes)[number]\ntype RouteBodyType = (typeof btypes)[number]\ntype RouteResultType = (typeof rtypes)[number]\ntype RouteResultInfo = RouteResultJson[] | 'String' | 'Buffer'\ntype Selects = string[] | number[] | readonly number[] | readonly string[]\n\ninterface RouteInfo {\n  $route: true\n  route: string\n  method: RouteMethod\n  name: string\n  queries: RouteQueryInfo[]\n  params: RouteParamInfo[]\n  bodies: RouteBodyInfo[]\n  files: RouteFileInfo[]\n  results: RouteResultInfo\n}\n\ninterface RouteQueryInfo {\n  $query: true\n  name: string\n  type: QueryType\n  optional: boolean\n  selects: Selects | null\n}\n\ninterface RouteParamInfo {\n  $param: true\n  name: string\n  type: ParamType\n  selects: Selects | null\n  optional: boolean\n}\n\ninterface RouteBodyInfo {\n  $body: true\n  name: string\n  type: RouteBodyType\n  optional: boolean\n  selects: Selects | null\n  object: RouteBodyInfo[]\n}\n\ninterface RouteFileInfo {\n  $file: true\n  name: string\n  type: FileType\n  optional: boolean\n  selects: null\n  validators: RouteFileInfoValidators\n}\n\ninterface RouteFileInfoValidators {\n  maxsize: number\n  limit: number\n  mimetypes: null | string[]\n}\n\ninterface RouteResultJson {\n  $result: true\n  name: string\n  type: RouteResultType\n  optional: boolean\n  selects: Selects | null\n  object: RouteResultJson[]\n}\n";
var templateBasics = function templateBasics(site, loggerImport, loggerMethod) {
  var logger = loggerImport && loggerMethod;
  return "\nimport axios, { AxiosError, AxiosProgressEvent, AxiosRequestConfig, AxiosResponse, ResponseType } from 'axios' // prettier-ignore\nimport { AnyObject } from 'tn-typescript'\n".concat(logger ? "import { ".concat(loggerMethod, " } from '").concat(loggerImport, "'") : '', "\n\nexport type RouteAuth = (callback: (accessToken: string) => void) => void\ninterface AxiosRequestProps<V = AnyObject, R = any> {\n  auth?: RouteAuth\n  variables?: V\n  signal?: AbortSignal\n  headers?: AnyObject\n  onProgress?: (e: AxiosProgressEvent) => void\n  onSuccess?: (data: R, res: AxiosResponse<R>) => void\n  onError?: (err: AxiosError) => void\n  onFinally?: () => void\n}\n\nconst createUrl = (info: RouteInfo, variables: AnyObject) => {\n  const site = '").concat(site.replace(/[\\\/]$/, ''), "/'\n  const queries = info.queries.map(({ name }) => name + '=' + String(variables[name])).join('&')\n  const urlr = info.route.replace(/\\:(\\w+)/g, (_, k) => {\n    const val = variables[k]\n    const isnull = val === null || val === undefined\n    return isnull ? '-' : encodeURIComponent(val)\n  })\n  return site + urlr.replace(/^[\\\\\\/]/, '') + (queries ? '?' : '') + queries\n}\n\nconst createAxiosRequest = (info: RouteInfo, props: AxiosRequestProps) => {\n  const { onProgress, onSuccess, onError, onFinally, signal } = props\n  const { auth, variables = {}, headers = {} } = props\n  const url = createUrl(info, variables)\n  const multipart = !!info.files.length\n  if (multipart) headers['Content-Type'] = false\n\n  let responseType: ResponseType = 'json'\n  if (info.results === 'Buffer') responseType = 'arraybuffer'\n  else if (info.results === 'String') responseType = 'text'\n\n  let data: AnyObject | FormData\n  if (multipart) {\n    const formdata = new FormData()\n    const entries = [...info.files, ...info.bodies]\n    entries.forEach(({ name }) => {\n      const entry = variables[name]\n      if (entry) formdata.set(name, entry)\n    })\n    data = formdata\n  } else {\n    const simpledata: AnyObject = {}\n    info.bodies.forEach(({ name }) => (simpledata[name] = variables[name]))\n    data = simpledata\n  }\n\n  const sendRequest = (accessToken?: string) => {\n    if (accessToken) headers.authorization = `Bearer ${accessToken}`\n    const req: AxiosRequestConfig = { method: info.method, url, signal, responseType, data, headers, onUploadProgress: onProgress } // prettier-ignore\n    ").concat(logger ? "".concat(loggerMethod, "(req)") : '', "\n    axios\n      .request(req)\n      .then(res => onSuccess && onSuccess(res.data, res))\n      .catch(err => onError && onError(err))\n      .finally(() => onFinally && onFinally())\n  }\n\n  if (!auth) sendRequest()\n  else auth((accessToken) => sendRequest(accessToken)) \n}\n");
};
var selectUnion = function selectUnion(selects) {
  return selects.map(function (s) {
    return tnValidate.isString(s) ? "'".concat(s, "'") : s;
  }).join(' | ');
};
var templateRoute = function templateRoute(routeinfo) {
  var name = routeinfo.name.replace(/Route$/, '');
  var vartypes = loopableType(routeinfo.bodies);
  var pqfs = [].concat(_toConsumableArray(routeinfo.params), _toConsumableArray(routeinfo.queries), _toConsumableArray(routeinfo.files));
  pqfs.forEach(function (_ref) {
    var type = _ref.type,
      name = _ref.name,
      optional = _ref.optional,
      selects = _ref.selects;
    var vtype = type === 'file' ? 'File' : type === 'file[]' ? 'File[]' : type;
    var ttype = selects ? selectUnion(selects) : "".concat(vtype).concat(optional ? ' | null' : '');
    vartypes += "".concat(name).concat(optional ? '?' : '', ":").concat(ttype, ";");
  });
  var r = routeinfo.results;
  var istype = r === 'Buffer' || r === 'String';
  var res = r === 'Buffer' ? 'ArrayBuffer' : r === 'String' ? 'string' : loopableType(r);
  return "\nconst info".concat(name, ": RouteInfo = ").concat(JSON.stringify(routeinfo), "\nexport interface Route").concat(name, "Variables {").concat(vartypes, "}\nexport ").concat(istype ? 'type' : 'interface', " Route").concat(name, "Result ").concat(istype ? "= ".concat(res) : "{".concat(res, "}"), "\nexport const url").concat(name, " = (variables: Route").concat(name, "Variables) => createUrl(info").concat(name, ", variables)\nexport const axios").concat(name, " = (props: AxiosRequestProps<Route").concat(name, "Variables, Route").concat(name, "Result>) => createAxiosRequest(info").concat(name, ", props)\n");
};
var loopableType = function loopableType(infos) {
  var strtype = '';
  infos.forEach(function (_ref2) {
    var name = _ref2.name,
      type = _ref2.type,
      optional = _ref2.optional,
      selects = _ref2.selects,
      object = _ref2.object;
    var isobj = type === 'object' || type === 'object[]';
    if (!isobj) {
      var ttype = selects ? selectUnion(selects) : "".concat(type).concat(optional ? ' | null' : '');
      strtype += "".concat(name).concat(optional ? '?' : '', ":").concat(ttype, ";");
    } else {
      var isarr = type === 'object[]';
      var loopttype = "{".concat(loopableType(object), "}").concat(isarr ? '[]' : '').concat(optional ? ' | null' : '');
      var _ttype = selects ? selectUnion(selects) : loopttype;
      strtype += "".concat(name).concat(optional ? '?' : '', ":").concat(_ttype, ";");
    }
  });
  return strtype;
};
var configpath = path__namespace.join(process.cwd(), 'routes.json');
var configs = fs__namespace.readJsonSync(configpath);
configs.forEach(function (config) {
  return createRouteFile(config);
});
function createRouteFile(_x) {
  return _createRouteFile.apply(this, arguments);
}
function _createRouteFile() {
  _createRouteFile = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(config) {
    var site, schema, outpath, loggerImport, loggerMethod, routesinfo, outdata;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          site = config.site, schema = config.schema, outpath = config.outpath, loggerImport = config.loggerImport, loggerMethod = config.loggerMethod;
          if (!(!site || !schema || !outpath)) {
            _context.next = 3;
            break;
          }
          throw new Error('Malformed config file\n');
        case 3:
          _context.next = 5;
          return axios.get(schema, {
            responseType: 'json'
          });
        case 5:
          routesinfo = _context.sent.data;
          outdata = templateInterfaces + templateBasics(site, loggerImport, loggerMethod);
          routesinfo.forEach(function (routeinfo) {
            return outdata += templateRoute(routeinfo);
          });
          fs__namespace.outputFileSync(path__namespace.join(process.cwd(), outpath), outdata);
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _createRouteFile.apply(this, arguments);
}
