'use strict'

import Lodash from 'lodash'

class ComponentRegistry {
  constructor () {
    this.registry = {}
    this.groups = {}
  }

  _initRegistry (component) {
    if (typeof this.registry[ component ] === 'undefined') {
      this.registry[ component ] = {
        creators: [],
        defaultCreator: null
      }
    }
  }

  add (component, creator, source) {
    this._initRegistry(component)
    if (!Lodash.isFunction(creator)) {
      throw new Error('creator for component ' + component + 'is not a function')
    }
    this.registry[ component ].creators.push(creator)
    if (process.env.NODE_ENV !== 'production') {
      console.info('[ComponentRegistry] creator added for polymorphism component ' + component + ' from ' + (source || 'Unknown'))
    }
  }

  define (component, defaultCreator, source) {
    this._initRegistry(component)
    if (!Lodash.isFunction(defaultCreator)) {
      throw new Error('defaultCreator for polymorphism component ' + component + 'is not a function')
    }
    this.registry[ component ].defaultCreator = defaultCreator
    if (process.env.NODE_ENV !== 'production') {
      console.info('[ComponentRegistry] defined polymorphism component ' + component + ' from ' + (source || 'Unknown'))
    }
  }

  get (component) {
    var args = Array.prototype.slice.call(arguments, 1)
    this._initRegistry(component)
    for (var i = 0, l = this.registry[ component ].creators.length; i < l; i++) {
      var instance = this.registry[ component ].creators[ i ].apply(null, args)
      if (instance !== false && instance !== null && typeof instance !== 'undefined') {
        return instance
      }
    }
    if (Lodash.isFunction(this.registry[ component ].defaultCreator)) {
      return this.registry[ component ].defaultCreator.apply(null, args)
    }
    throw new Error('component ' + component + 'is not found')
  }

  defineGroup (group, baseComponent, source) {
    if (typeof this.groups[ group ] === 'undefined') {
      this.groups[ group ] = baseComponent
      if (process.env.NODE_ENV !== 'production') {
        console.info('[ComponentRegistry] defined group "' + group + '" from ' + (source || 'Unknown'))
      }
    }
  }

  groupTo (group, name, component, source) {
    if (typeof this.groups[ group ] === 'undefined') {
      return
    }
    this.groups[ group ][ name ] = component
    if (process.env.NODE_ENV !== 'production') {
      console.info(
        '[ComponentRegistry] "' + group + '.' + name + '" is grouped from ' + (source || 'Unknown') + '. ' +
        'Now you can use it in any component.'
      )
    }
  }
}

const componentRegistrySingleton = new ComponentRegistry()
if (process.env.NODE_ENV !== 'production') {
  global.ComponentRegistry = componentRegistrySingleton
}
export default componentRegistrySingleton
