'use strict'

import {
  startSubmit as formStartSubmit,
  stopSubmit as formStopSubmit,
  initialize as formInitialize,
  reset as formReset
} from 'redux-form'

import { CompanySocket } from '../../api/CompanySocket'
import * as Constants from '../lib/constants'
import * as Types from '../lib/actionTypes'
import { setFlashLogDisplayIn, displayFlashLog } from '../../log'

export function joinRoom () {
  return function (dispatch) {
    CompanySocket.Employee
      .join()
      .onCreated(function (employee) {
        dispatch({ type: Types.EMPLOYEE_CREATED, employee })
      })
      .onUpdated(function (employee) {
        dispatch({ type: Types.EMPLOYEE_UPDATED, employee })
      })
      .onDeleted(function (employee) {
        dispatch({ type: Types.EMPLOYEE_DELETED, employee })
      })
  }
}

export function leaveRoom () {
  return function (dispatch) {
    CompanySocket.Employee.leave()
  }
}

export function createEmployee (formData) {
  return function (dispatch) {
    dispatch(formStartSubmit(Constants.FORM_CREATE_EMPLOYEE))
    CompanySocket.Employee.createEmployee(formData, function (result) {
      if (!result.ok) {
        return dispatch(formStopSubmit(Constants.FORM_CREATE_EMPLOYEE, result.errors))
      }

      dispatch(formStopSubmit(Constants.FORM_CREATE_EMPLOYEE))
      dispatch(formReset(Constants.FORM_CREATE_EMPLOYEE))
      dispatch({ type: Types.EMPLOYEE_CREATED, employee: result.employee })
    })
  }
}

export function updateEmployee (formData) {
  return function (dispatch) {
    dispatch(formStartSubmit(Constants.FORM_UPDATE_EMPLOYEE))
    CompanySocket.Employee.updateEmployee(formData, function (result) {
      if (!result.ok) {
        return dispatch(formStopSubmit(Constants.FORM_UPDATE_EMPLOYEE, result.errors))
      }

      dispatch(formStopSubmit(Constants.FORM_UPDATE_EMPLOYEE))
      dispatch({ type: Types.EMPLOYEE_UPDATED, employee: result.employee })
      dispatch(closeUpdateEmployeeModal())
    })
  }
}

export function openUpdateEmployeeModal (formData) {
  return { type: Types.START_UPDATE_EMPLOYEE, id: formData.id }
}

export function closeUpdateEmployeeModal () {
  return { type: Types.CANCEL_UPDATE_EMPLOYEE }
}

export function enableEmployee (formData) {
  return function (dispatch) {
    CompanySocket.Employee.updateEmployee({ id: formData.id, status: Constants.STATUS_ACTIVE }, function (result) {
      if (result.ok) {
        dispatch({ type: Types.EMPLOYEE_UPDATED, employee: result.employee })
      }
    })
  }
}

export function disableEmployee (formData) {
  return function (dispatch) {
    CompanySocket.Employee.updateEmployee({ id: formData.id, status: Constants.STATUS_INACTIVE }, function (result) {
      if (result.ok) {
        dispatch({ type: Types.EMPLOYEE_UPDATED, employee: result.employee })
      }
    })
  }
}

export function deleteEmployee (formData) {
  return function (dispatch) {
    CompanySocket.Employee.deleteEmployee(formData, function (result) {
      if (!result.ok) {
        return
      }

      dispatch({ type: Types.EMPLOYEE_DELETED, employee: result.employee })
      dispatch(setFlashLogDisplayIn(result.log, 5))
    })
  }
}

export function getEmployees () {
  return function (dispatch) {
    CompanySocket.Employee.getEmployees({}, function (result) {
      if (!result.ok) {
        return
      }
      dispatch({ type: Types.SET_EMPLOYEE_LIST, employees: result.employees })
    })
  }
}
