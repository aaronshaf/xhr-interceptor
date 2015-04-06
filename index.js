'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});
/* global window */

var _RouteRecognizer = require('route-recognizer');

var _RouteRecognizer2 = _interopRequireWildcard(_RouteRecognizer);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireWildcard(_objectAssign);

var _methods = require('methods');

var _methods2 = _interopRequireWildcard(_methods);

var FakeXMLHttpRequest = require('fake-xml-http-request/dist/cjs/index')['default'];

var Router = function Router() {
  var _this = this;

  _classCallCheck(this, Router);

  this.routes = {};

  _methods2['default'].forEach(function (method) {
    _this.routes[method] = [];
    _this[method] = function () {
      var path = arguments[0] === undefined ? '/' : arguments[0];
      var handler = arguments[1] === undefined ? function () {} : arguments[1];

      _this.routes[method].push({ path: path, handler: handler });
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
      _this2.routes[method] = new _RouteRecognizer2['default']();
      _this2[method] = function () {
        var path = arguments[0] === undefined ? '/' : arguments[0];
        var handler = arguments[1] === undefined ? function () {} : arguments[1];

        _this2.routes[method].add([{ path: path, handler: handler }]);
      };
    });
  }

  _createClass(Interceptor, [{
    key: 'use',
    value: function use() {
      var _this3 = this;

      var router = arguments[0] === undefined ? new Router() : arguments[0];

      _methods2['default'].forEach(function (method) {
        _this3.routes[method].add(router.routes[method]);
      });
    }
  }, {
    key: 'listen',
    value: function listen() {
      this.listening = true;
      this._nativeXMLHttpRequest = window.XMLHttpRequest;
      window.XMLHttpRequest = this.intercept(this);
    }
  }, {
    key: 'close',
    value: function close() {
      this.listening = false;
      window.XMLHttpRequest = this._nativeXMLHttpRequest;
      delete this._nativeXMLHttpRequest;
    }
  }, {
    key: 'intercept',
    value: function intercept() {
      var routes = this.routes;

      function FakeRequest() {
        FakeXMLHttpRequest.call(this);
      }

      var proto = new FakeXMLHttpRequest();
      proto.send = function () {
        FakeXMLHttpRequest.prototype.send.apply(this, arguments);

        var verb = this.method.toLowerCase();
        var path = this.url;

        var matches = routes[verb].recognize(path);
        var match = matches ? matches[0] : null;

        if (match) {
          this.params = match.params;
          var response = new Response(this);
          match.handler(this, response);
        }
      };
      FakeRequest.prototype = proto;

      return FakeRequest;
    }
  }, {
    key: '__initializeProperties',
    value: function __initializeProperties() {
      this.listening = false;
      this.routes = {};
    }
  }]);

  return Interceptor;
})();

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

exports['default'] = Interceptor;
