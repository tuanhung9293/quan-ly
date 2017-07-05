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
import { push } from 'react-router-redux'

export function pageLoad (tab, roleId) {
  return { type: Types.INITIALIZE_STATE, tab: tab, preselect_id: roleId }
}

export function selectTab (tab) {
  return { type: Types.SELECT_TAB, tab: tab }
}

export function setLoading (loading) {
  return { type: Types.SET_LOADING, loading }
}

export function joinRoom () {
  return function (dispatch) {
    return CompanySocket.AccessRights
      .join()
      .onRoleCreated(function (role) {
        dispatch({ type: Types.ROLE_CREATED, role })
      })
      .onRoleUpdated(function (role) {
        dispatch({ type: Types.ROLE_UPDATED, role })
      })
      .onRoleDeleted(function (role) {
        dispatch({ type: Types.ROLE_DELETED, role })
      })
  }
}

export function leaveRoom () {
  return function (dispatch) {
    return CompanySocket.AccessRights.leave()
  }
}

export function selectRole (id) {
  return { type: Types.SELECT_ROLE, id: id }
}

export function selectRoleById (id) {
  return { type: Types.SELECT_ROLE, id: id }
}

export function createRole (formData) {
  return function (dispatch) {
    return CompanySocket.AccessRights.createRole(formData).then(function (result) {
      dispatch({ type: Types.ROLE_CREATED, role: result.role })
      dispatch(toggleRoleUpdateFormEditMode(true))
    })
  }
}

export function toggleRoleUpdateFormEditMode (open) {
  return { type: Types.TOGGLE_ROLE_UPDATE_FORM_EDIT_MODE, open: open || 'toggle' }
}

export function updateRole (formData) {
  return function (dispatch) {
    return CompanySocket.AccessRights.updateRole(formData).then(function (result) {
      dispatch({ type: Types.ROLE_UPDATED, role: result.role })
      dispatch(selectRole(result.role.id))
      dispatch(toggleRoleUpdateFormEditMode(false))
    })
  }
}

export function deleteRole (formData) {
  return function (dispatch) {
    CompanySocket.AccessRights.deleteRole(formData, function (result) {
      if (!result.ok) {
        return
      }

      dispatch({ type: Types.ROLE_DELETED, role: result.role })
      dispatch(setFlashLogDisplayIn(result.log, 5))
      dispatch(push(Constants.CONFIGURATION_BASE_URL))
    })
  }
}

export function restoreRole (formData) {
  return function (dispatch) {
    CompanySocket.AccessRights.restoreRole(formData, function (result) {
      if (!result.ok) {
        return
      }

      dispatch({ type: Types.ROLE_CREATED, role: result.role })
    })
  }
}

export function getRoles () {
  return function (dispatch) {
    return CompanySocket.AccessRights.getRoles({}).then(function (result) {
      dispatch({ type: Types.SET_ROLE_LIST, roles: result.roles })
      return result
    })
  }
}
