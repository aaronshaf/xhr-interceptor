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
//    app.listen()

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
//    app.listen()

    let response = await axios.get('/user/1')
    expect(JSON.stringify(response.data)).toBe(JSON.stringify({
      user: { id: '1' }
    }))

    app.close()
  })
})
