import Interceptor from '../index.es6'
import expect from 'expect'
import axios from 'axios'

//import usersRouter from './routes/users'

describe('basics', () => {
  let app

  beforeEach(() => {
    app = new Interceptor
  })

  afterEach(() => {
    app.close()
  })

  it('without params', async function() {
    app.get('/foo', (req, res) => {
      res.send('bar')
    })

    let response = await axios.get('/foo')
    expect(response.data).toBe('bar')
  })

  it('with params', async function() {
    app.get('/user/:id', (req, res) => {
      res.json({
        user: { id: req.params.id }
      })
    })

    let response = await axios.get('/user/1')
    expect(response.data).toEqual({
      user: { id: '1' }
    })
  })

  it('returns 404 with blank body', async function() {
    app.get('/foo', (req, res) => {
      res.sendStatus(404)
    })

    try {
      let response = await axios.get('/foo')
      throw new Error()
    } catch(err) {
      expect(err.status).toBe(404)
    }
  })

  it('post', async function() {
    app.post('/foo', (req, res) => {
      res.sendStatus(201)
    })

    let response = await axios.post('/foo')
    expect(response.status).toBe(201)
  })
})
