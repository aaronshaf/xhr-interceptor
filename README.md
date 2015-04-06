### Examples

```javascript
var app = new ClientExpress;
app.get('/users/1', function(req, res) {
	res.json({ foo: 'bar' })
});

```

### Development

```
npm install
npm run dev
```

### Build

```
npm install
npm run build
```
