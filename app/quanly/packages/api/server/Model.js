'use strict'

export default class Model {
  data$ (input) {
    if (typeof input === 'undefined') {
      return this.toJSON({ getters: true })
    }

    for (var name in input) {
      this[ name ] = input[ name ]
    }
  }

  toEntity () {
    var data = this.toJSON({ getters: true })
    delete data._id
    return this.schema.get('entity').make$(data)
  }

  static getEntity () {
    return this.schema.get('entity')
  }
}

export { Model }