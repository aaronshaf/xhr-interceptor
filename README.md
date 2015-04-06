### Examples

```
npm install xhr-interceptor --save-dev
```

```javascript
import Interceptor from 'xhr-interceptor'
import expect from 'expect'
import axios from 'axios'

describe('basics', () => {
  it('without params', async function() {
    let app = new Interceptor

    app.get('/foo', (req, res) => {
      res.send('bar')
    })

    let response = await axios.get('/foo')
    expect(response.data).toBe('bar')

    app.close()
  })

  it('with params', async function() {
    let app = new Interceptor

    app.get('/user/:id', (req, res) => {
      res.json({
        user: { id: req.params.id }
      })
    })

    let response = await axios.get('/user/1')
    expect(JSON.stringify(response.data)).toBe(JSON.stringify({
      user: { id: '1' }
    }))

    app.close()
  })
})
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
