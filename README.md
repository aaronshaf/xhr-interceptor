### Examples

```javascript
var app = new FakeExpress;
app.get('/api/v1/courses/:course_id/modules.json', function(req, res) {
	res.json({foo:bar});
});

var server = sinon.fakeServer.create();
server.autoRespond = true;
server.respondWith(app);

```

### Development

```
npm install
npm start
```