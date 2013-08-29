(function() {
  test('Loads', function() {
    var app, server;
    app = new FakeExpress;
    app.get('/api/v1/courses/:course_id/modules.json', function(req, res) {
      return res.json({
        foo: bar
      });
    });
    server = sinon.fakeServer.create();
    server.autoRespond = true;
    server.respondWith(app);
    return ok(1);
  });

}).call(this);

/*
//@ sourceMappingURL=main.js.map
*/