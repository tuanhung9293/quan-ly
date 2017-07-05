'use strict'

import * as ActionTypes from '../lib/actionTypes'

const Lodash = require('lodash')
import { Map } from 'immutable'

const initialState = {
  employees: Map(),
  loading: true,
  updating_employee: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOADING_EMPLOYEES:
      return Lodash.assign({}, state, { loading: true })

    case ActionTypes.SET_EMPLOYEE_LIST:
      var employees = {}
      action.employees.map(function (item) {
        employees[ item.id ] = item
      })
      return Lodash.assign(
        {}, state,
        {
          employees: Map(employees),
          loading: false
        }
      )

    case ActionTypes.START_UPDATE_EMPLOYEE:
      return Lodash.assign({}, state, {
        updating_employee: state.employees.get(action.id)
      })

    case ActionTypes.CANCEL_UPDATE_EMPLOYEE:
      return Lodash.assign({}, state, {
        updating_employee: null
      })

    case ActionTypes.EMPLOYEE_CREATED:
      return Lodash.assign({}, state, {
        employees: state.employees.set(action.employee.id, action.employee)
      })

    case ActionTypes.EMPLOYEE_UPDATED:
      if (state.updating_employee !== null && state.updating_employee.id === action.employee.id) {
        return Lodash.assign({}, state, {
          updating_employee: action.employee,
          employees: state.employees.set(action.employee.id, action.employee)
        })
      }
      return Lodash.assign({}, state, {
        employees: state.employees.set(action.employee.id, action.employee)
      })

    case ActionTypes.EMPLOYEE_DELETED:
      var employees = state.employees.delete(action.employee.id)
      if (state.updating_employee !== null && state.updating_employee.id === action.employee.id) {
        return {
          updating_employee: null,
          employees: employees,
        }
      }
      return Lodash.assign({}, state, {
        employees: employees
      })

    default:
      return state
  }
}
