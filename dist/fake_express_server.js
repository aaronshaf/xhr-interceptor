(function() {
  var FakeExpress, FakeRequest, FakeResponse, module;

  FakeRequest = (function() {
    function FakeRequest() {}

    return FakeRequest;

  })();

  FakeResponse = (function() {
    function FakeResponse(xhr) {
      this.xhr = xhr;
      this.statusCode = 200;
      this.headers = {
        'Content-Type': 'application/json'
      };
    }

    FakeResponse.prototype.status = function(code) {
      this.statusCode(code);
      return this;
    };

    FakeResponse.prototype.set = function(field, value) {
      var header, _results;
      if (value && typeof field === 'string') {
        return this[field] = value;
      } else if (typeof field === 'object') {
        _results = [];
        for (header in field) {
          value = field[header];
          _results.push(this[header] = value);
        }
        return _results;
      }
    };

    FakeResponse.prototype.get = function(field) {
      return this[field];
    };

    FakeResponse.prototype.send = function(statusCode, body) {
      if (typeof status === 'number') {
        return xhr.respond(statusCode, this.headers, body);
      }
      if (typeof statusCode === 'string' && !body) {
        return xhr.respond(this.statusCode, this.headers, statusCode);
      }
    };

    FakeResponse.prototype.json = function(status, body) {
      this.set('Content-Type', 'application/json');
      return this.send(status, body);
    };

    FakeResponse.prototype.type = function(type) {
      return this.headers['Content-Type'] = type;
    };

    FakeResponse.prototype.links = function(links) {
      var header, link, uri;
      header = [];
      for (uri in links) {
        link = links[uri];
        header.push("<" + link + ">; rel=\"" + uri + "\"");
      }
      return this.set('Link', header.join(','));
    };

    return FakeResponse;

  })();

  FakeExpress = (function() {
    function FakeExpress(server) {
      this.server = server;
      this.routes = [];
    }

    FakeExpress.prototype.get = function(url, callback) {
      return this.routes.push({
        url: url,
        callback: callback
      });
    };

    return FakeExpress;

  })();

  module = FakeExpress;

  if (typeof define === 'function' && (typeof define !== "undefined" && define !== null ? define.amd : void 0)) {
    define(function() {
      return module;
    });
  } else {
    window.FakeExpress = module;
  }

}).call(this);

/*
//@ sourceMappingURL=fake_express_server.js.map
*/