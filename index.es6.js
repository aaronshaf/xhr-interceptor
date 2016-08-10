/* global window */

import objectAssign from 'object-assign'
import pathToRegexp from 'path-to-regexp'
import methods from 'methods'
import zipObject from 'lodash-node/modern/array/zipObject'

var FakeXMLHttpRequest = require('fake-xml-http-request')
const NativeXMLHttpRequest = window.XMLHttpRequest

export class Router {
  routes = []

  constructor () {
    methods.forEach((method) => {
      this[method] = (path = '/', handler = () => {}) => {
        this.routes.push({ method, path, handler })
      }
    })
  }
}

export default class Interceptor {
  listening = false
  routes = []

  constructor ({listening = true} = {}) {
    if(listening) {
      this.listen()
    }
    methods.forEach((method) => {
      this[method] = (path = '/', handler = () => {}) => {
        this.routes.push({ method, path, handler })
      }
    })
  }

  use () {
    if(!arguments.length) {
      return false
    }

    if(arguments[0] instanceof Router) {
      let router = arguments[0]
      this.routes = this.routes.concat(router.routes)
    } else if(arguments[0] instanceof Function) {
      let middleware = arguments[0]
      this.routes.push({
        handler: router
      })
    } else if(arguments[0] instanceof Array) {
      // TODO
    } else if(typeof arguments[0] === 'string') {
      // TODO
    }
  }

  listen () {
    this.listening = true
    window.XMLHttpRequest = this.intercept(this)
  }

  close () {
    this.listening = false
    window.XMLHttpRequest = NativeXMLHttpRequest
    delete this._nativeXMLHttpRequest
  }

  matchRoutes ({path, method = null}) {
    return this.routes.map((route) => {
      if(method && route.method !== method) {
        return null
      }
      let keys = []
      const regexp = pathToRegexp(route.path, keys)
      const result = regexp.exec(path)
      if(!result) {
        return null
      }
      const params = zipObject(keys.map((key, i) => {
        return [key.name, result[i + 1]]
      }))
      return {
        path: route.path,
        handler: route.handler,
        method,
        params
      }
    }).filter(match => match)
  }

  intercept () {
    const routes = this.routes
    const matchRoutes = this.matchRoutes.bind(this)
    const _nativeXMLHttpRequest = this._nativeXMLHttpRequest

    function FakeRequest() {
      FakeXMLHttpRequest.call(this)
    }

    var proto = new FakeXMLHttpRequest()
    proto.send = function(body) {
      const verb = this.method.toLowerCase()
      const path = this.url

      const matches = matchRoutes({path, verb})
      if(!matches.length) {
        return NativeXMLHttpRequest.send.apply(this, arguments)
      }

      const response = new Response(this)
      var index = -1

      const next = () => {
        index++
        if(index > matches.length) {
          return false
        }
        let match = matches[index]
        this.params = match.params
        this.body = body
        match.handler(this, response, next)
      }

      next()
    }
    FakeRequest.prototype = proto

    return FakeRequest
  }
}

class Response {
  statusCode = 200
  headers = {
    'Content-Type': 'text/plain'
  }

  constructor (request) {
    this.request = request
  }

  status (code) {
    this.statusCode = code
  }

  sendStatus (code) {
    this.statusCode = code
    this.request.respond(this.statusCode, this.headers, '')
  }

  json (obj = {}) {
    this.set('Content-Type', 'application/json')
    this.request.respond(this.statusCode, this.headers, JSON.stringify(obj))
  }

  set (field = {}, value = null) {
    if(typeof field === 'object') {
      this.headers = object.assign({}, this.headers, field)
    } else if(typeof field === 'string') {
      this.headers[field] = value
    }
  }

  send (content) {
    this.request.respond(this.statusCode, this.headers, content)
  }
}
