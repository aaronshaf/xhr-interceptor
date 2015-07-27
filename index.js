'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});
/* global window */

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireWildcard(_objectAssign);

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireWildcard(_pathToRegexp);

var _methods = require('methods');

var _methods2 = _interopRequireWildcard(_methods);

var _zipObject = require('lodash-node/modern/array/zipObject');

var _zipObject2 = _interopRequireWildcard(_zipObject);

var FakeXMLHttpRequest = require('fake-xml-http-request');
var NativeXMLHttpRequest = window.XMLHttpRequest;

var Router = function Router() {
  var _this = this;

  _classCallCheck(this, Router);

  this.routes = [];

  _methods2['default'].forEach(function (method) {
    _this[method] = function () {
      var path = arguments[0] === undefined ? '/' : arguments[0];
      var handler = arguments[1] === undefined ? function () {} : arguments[1];

      _this.routes.push({ method: method, path: path, handler: handler });
    };
  });
};

exports.Router = Router;

var Interceptor = (function () {
  function Interceptor() {
    var _this2 = this;

    var _ref = arguments[0] === undefined ? {} : arguments[0];

    var _ref$listening = _ref.listening;
    var listening = _ref$listening === undefined ? true : _ref$listening;

    _classCallCheck(this, Interceptor);

    this.__initializeProperties();

    if (listening) {
      this.listen();
    }
    _methods2['default'].forEach(function (method) {
      _this2[method] = function () {
        var path = arguments[0] === undefined ? '/' : arguments[0];
        var handler = arguments[1] === undefined ? function () {} : arguments[1];

        _this2.routes.push({ method: method, path: path, handler: handler });
      };
    });
  }

  _createClass(Interceptor, [{
    key: 'use',
    value: function use() {
      var router = arguments[0] === undefined ? new Router() : arguments[0];

      if (router instanceof Router) {
        this.routes = this.routes.concat(router.routes);
      } else if (router instanceof Function) {}
    }
  }, {
    key: 'listen',
    value: function listen() {
      this.listening = true;
      window.XMLHttpRequest = this.intercept(this);
    }
  }, {
    key: 'close',
    value: function close() {
      this.listening = false;
      window.XMLHttpRequest = NativeXMLHttpRequest;
      delete this._nativeXMLHttpRequest;
    }
  }, {
    key: 'matchRoutes',
    value: function matchRoutes(_ref2) {
      var path = _ref2.path;
      var _ref2$method = _ref2.method;
      var method = _ref2$method === undefined ? null : _ref2$method;

      return this.routes.map(function (route) {
        if (method && route.method !== method) {
          return null;
        }
        var keys = [];
        var regexp = _pathToRegexp2['default'](route.path, keys);
        var result = regexp.exec(path);
        if (!result) {
          return null;
        }
        var params = _zipObject2['default'](keys.map(function (key, i) {
          return [key.name, result[i + 1]];
        }));
        return {
          path: route.path,
          handler: route.handler,
          method: method,
          params: params
        };
      }).filter(function (match) {
        return match;
      });
    }
  }, {
    key: 'intercept',
    value: function intercept() {
      var routes = this.routes;
      var matchRoutes = this.matchRoutes.bind(this);
      var _nativeXMLHttpRequest = this._nativeXMLHttpRequest;

      function FakeRequest() {
        FakeXMLHttpRequest.call(this);
      }

      var proto = new FakeXMLHttpRequest();
      proto.send = function () {
        var _this3 = this;

        var verb = this.method.toLowerCase();
        var path = this.url;

        var matches = matchRoutes({ path: path, verb: verb });
        if (!matches.length) {
          return NativeXMLHttpRequest.send.apply(this, arguments);
        }

        var response = new Response(this);
        var index = -1;

        var next = (function (_next) {
          function next() {
            return _next.apply(this, arguments);
          }

          next.toString = function () {
            return next.toString();
          };

          return next;
        })(function () {
          index++;
          if (index > matches.length) {
            return false;
          }
          var match = matches[index];
          _this3.params = match.params;
          match.handler(_this3, response, next);
        });

        next();
      };
      FakeRequest.prototype = proto;

      return FakeRequest;
    }
  }, {
    key: '__initializeProperties',
    value: function __initializeProperties() {
      this.listening = false;
      this.routes = [];
    }
  }]);

  return Interceptor;
})();

exports['default'] = Interceptor;

var Response = (function () {
  function Response(request) {
    _classCallCheck(this, Response);

    this.statusCode = 200;
    this.headers = {
      'Content-Type': 'text/plain'
    };

    this.request = request;
  }

  _createClass(Response, [{
    key: 'status',
    value: function status(code) {
      this.statusCode = code;
    }
  }, {
    key: 'sendStatus',
    value: function sendStatus(code) {
      this.statusCode = code;
      this.request.respond(this.statusCode, this.headers, '');
    }
  }, {
    key: 'json',
    value: function json() {
      var obj = arguments[0] === undefined ? {} : arguments[0];

      this.set('Content-Type', 'application/json');
      this.request.respond(this.statusCode, this.headers, JSON.stringify(obj));
    }
  }, {
    key: 'set',
    value: function set() {
      var field = arguments[0] === undefined ? {} : arguments[0];
      var value = arguments[1] === undefined ? null : arguments[1];

      if (typeof field === 'object') {
        this.headers = object.assign({}, this.headers, field);
      } else if (typeof field === 'string') {
        this.headers[field] = value;
      }
    }
  }, {
    key: 'send',
    value: function send(content) {
      this.request.respond(this.statusCode, this.headers, content);
    }
  }]);

  return Response;
})();

// TODO enable normal app.use
