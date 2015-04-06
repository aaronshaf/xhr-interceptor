import Interceptor from '../index.es6'
import expect from 'expect'
import axios from 'axios'

//import usersRouter from './routes/users'

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

  it('returns 404 with blank body', async function() {
    let app = new Interceptor

    app.get('/foo', (req, res) => {
      res.sendStatus(404)
    })

    var response
    try {
      response = await axios.get('/foo')
      throw new Error()
    } catch(err) {
      expect(err.status).toBe(404)
    }

    app.close()
  })
})
