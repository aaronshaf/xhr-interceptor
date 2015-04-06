### Examples

```
npm install xhr-interceptor --save-dev
```

```javascript
import Interceptor from 'xhr-interceptor'

let app = new Interceptor
app.get('/users/:id', function(req, res) {
	res.json({ userId: req.params.id })
})

app.close()

```

### Development

```
npm run dev
```

### Test

```
npm test
```

### Build

```
npm run build
```
