'use strict'

import Lodash from 'lodash'
import { Map, List } from 'immutable'

function warn (text) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(text)
  }
}

export default class Reducer {
  /**
   * define Store name of this reducer
   * @type {string}
   */
  store = ''

  /**
   * Initial state
   * @type {{}}
   */
  initialState = {}

  /**
   * define mapping from actionTypes to function
   * @type {{}}
   */
  handlers = {}

  /**
   * Main reduce function
   * @param state
   * @param payload
   * @returns {*}
   */
  reduce (state, payload) {
    if (typeof state === 'undefined') state = this.initialState

    if (Lodash.isFunction(this.handlers[ payload.type ])) {
      var result = this.handlers[ payload.type ].call(this, state, payload)

      if (typeof result === 'undefined' || result === null) {
        return state
      }

      if (!Lodash.isObject(result)) {
        warn(this.store + ': Reducer handler function must be return an object')
        return state
      }

      if (!Lodash.isEmpty(result)) {
        return Object.assign({}, state, result)
      }
    }

    return state
  }

  /**
   * Parameterize the function, move state and payload to this operator, it will looks like an
   * action function.
   * @param func
   * @returns {Function}
   */
  parameterize (func) {
    var args = Array.prototype.slice.apply(arguments, [ 1 ])
    return function (state, payload) {
      var appliedArgs = args.map(function (name) {
        return typeof payload[ name ] !== 'undefined' ? payload[ name ] : undefined
      })
      return func.apply({ state: state, payload: payload }, appliedArgs)
    }
  }

  // Helper functions --------------------------------------------------------------
  /**
   * Toggle a property in state
   * @param state
   * @param property
   * @param input could be 'toggle', true|false
   * @returns {{}}
   */
  toggleProperty (state, property, input) {
    return {
      [property]: Reducer.Util.toggleBoolean(state[ property ], input)
    }
  }

  /**
   * converts Array to List and assigns to property in the state
   * @param property
   * @param array
   * @returns {{}}
   */
  createPropertyFromArray (property, array) {
    return {
      [property]: List(array)
    }
  }

  /**
   * converts Object to Map and assigns to property in state
   * @param property
   * @param object
   * @returns {{}}
   */
  createPropertyFromObject (property, object) {
    return {
      [property]: Map(object)
    }
  }

  // Utilities --------------------------------------------------------------
  /**
   * Create reducer object which can be used by combineReducers
   * @param instance
   * @returns {*}
   */
  static createReducer (instance) {
    if (!(instance instanceof Reducer)) {
      return warn('createCombineObject for the object which is NOT the instance of Reducer')
    }

    return {
      [instance.store]: instance.reduce.bind(instance)
    }
  }

  /**
   * Utilities, used for common actions
   * @type {{convertArrayToImmutableMap: Reducer.Util.convertArrayToImmutableMap, toggleBoolean: Reducer.Util.toggleBoolean, selectItemInMap: ((map, itemId?, firstFallback?))}}
   */
  static Util = {
    /**
     * Convert an array of objects and key by a field in that object to Map
     * @param array
     * @param keyField
     * @returns {*|Map<K, V>|Map<string, V>}
     */
    convertArrayToImmutableMap: function (array, keyField) {
      return Map(
        array.reduce(function (carry, item) {
          carry[ item[ keyField ] ] = item
          return carry
        }, {})
      )
    },

    /**
     * Toggle a boolean value
     * @param val
     * @param input could be 'toggle' | true | false
     * @returns {*}
     */
    toggleBoolean: function (val, input) {
      if (typeof input === 'undefined' || input === 'toggle') {
        return !val
      }
      return new Boolean(input).valueOf()
    },

    /**
     * check and select the item by id in Map, [use first()] otherwise
     * @param map
     * @param itemId
     * @param firstFallback boolean
     * @returns {null}
     */
    selectItemInMap(map, itemId, firstFallback = true) {
      if (map.has(itemId)) {
        return map.get(itemId)
      }

      return firstFallback ? map.first() : null
    }
  }
}
