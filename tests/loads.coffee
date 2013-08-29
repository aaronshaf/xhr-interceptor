test 'Loads', ->
  app = new FakeExpress
  app.get '/api/v1/courses/:course_id/modules.json', (req, res) ->
    res.json({foo:bar})

  server = sinon.fakeServer.create()
  server.autoRespond = true;
  server.respondWith app
  ok 1