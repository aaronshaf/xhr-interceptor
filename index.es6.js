/* global window */

import RouteRecognizer from 'route-recognizer'
import objectAssign from 'object-assign'
import methods from 'methods'
var FakeXMLHttpRequest = require('fake-xml-http-request/dist/cjs/index').default

export class Router {
  routes = {}

  constructor() {
    methods.forEach((method) => {
      this.routes[method] = []
      this[method] = (path = '/', handler = () => {}) => {
        this.routes[method].push([{ path, handler }])
      }
    })
  }

  use() {

  }
}

class Interceptor {
  listening = false
  routes = {}

  constructor({listening = true} = {}) {
    if(listening) {
      this.listen()
    }
    methods.forEach((method) => {
      this.routes[method] = new RouteRecognizer()
      this[method] = (path = '/', handler = () => {}) => {
        this.routes[method].add([{ path, handler }])
      }
    })
  }

  use(prefixOrRouter, router = null) {
    if(!router && prefixOrRouter) {
      router = prefixOrRouter
      // encorporate route handlers
    }
  }

  listen() {
    this.listening = true
    this._nativeXMLHttpRequest = window.XMLHttpRequest
    window.XMLHttpRequest = this.intercept(this)
  }

  close() {
    this.listening = false
    window.XMLHttpRequest = this._nativeXMLHttpRequest
    delete this._nativeXMLHttpRequest
    // TODO: remove handlers
  }

  intercept() {
    let routes = this.routes

    function FakeRequest() {
      FakeXMLHttpRequest.call(this)
    }

    var proto = new FakeXMLHttpRequest()
    proto.send = function() {
      FakeXMLHttpRequest.prototype.send.apply(this, arguments)

      let verb = this.method.toLowerCase()
      let path = this.url

      let matches = routes[verb].recognize(path)
      var match = matches ? matches[0] : null

      if(match) {
        this.params = match.params
        let response = new Response(this)
        match.handler(this, response)
      }

      // console.log({matches})
    }
    FakeRequest.prototype = proto

    // console.log({FakeXMLHttpRequest})
    return FakeRequest
    /*
    let xhr = new FakeXMLHttpRequest()
    xhr.send = function() {
      // let matches = this.router.recognize("/admin/posts")
      /*


      console.log(arguments)
      console.log({verb, path})
      */
    //}
    //return xhr



    /*
    let result = this.router.recognize(`${verb}--${path}`)
    */

    // var verb = request.method.toUpperCase();
  }
}

class Response {
  statusCode = 200
  headers = {
    'Content-Type': 'text/plain'
  }

  constructor(request) {
    this.request = request
  }

  status(code) {
    this.statusCode = code
  }

  sendStatus(code) {
    this.statusCode = code
    this.request.respond(this.statusCode, this.headers, '')
  }

  json(obj = {}) {
    this.set('Content-Type', 'application/json')
    this.request.respond(this.statusCode, this.headers, JSON.stringify(obj))
  }

  set(field = {}, value = null) {
    if(typeof field === 'object') {
      this.headers = object.assign({}, this.headers, field)
    } else if(typeof field === 'string') {
      this.headers[field] = value
    }
  }

  send(content) {
    this.request.respond(this.statusCode, this.headers, content)
  }
}

export default Interceptor
