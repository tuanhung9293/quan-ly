'use strict'

import { CompanySocket } from '../../api/CompanySocket'
import * as Types from '../lib/actionTypes'
import {STATUS_ACTIVE, STATUS_INACTIVE} from '../lib/constants'
import { setFlashLogDisplayIn, displayFlashLog } from '../../log'

export function joinRoom () {
  return function (dispatch) {
    return CompanySocket.Supplier.join()
      .onSupplierCreated(function (supplier) {
        dispatch({ type: Types.SUPPLIER_CREATED, supplier })
      })
      .onSupplierUpdated(function (supplier) {
        dispatch({ type: Types.SUPPLIER_UPDATED, supplier })
      })
      .onSupplierDeleted(function (supplier) {
        dispatch({ type: Types.SUPPLIER_DELETED, supplier })
      })
      .onGroupCreated(function (supplierGroup) {
        dispatch({ type: Types.GROUP_CREATED, supplierGroup })
      })
      .onGroupUpdated(function (supplierGroup) {
        dispatch({ type: Types.GROUP_UPDATED, supplierGroup })
      })
      .onGroupDeleted(function (supplierGroup) {
        dispatch({ type: Types.GROUP_DELETED, supplierGroup })
      })
      .onSupplierUnassigned(function(supplier_id){
        dispatch({type: Types.SUPPLIER_UNASSIGNED, supplier_id})
      })
  }
}

export function leaveRoom () {
  return function (dispatch) {
    return CompanySocket.Supplier.leave()
  }
}

export function selectTab (tab) {
  return { type: Types.SELECT_TAB, tab: tab }
}

export function selectGroupById (supplierGroupId) {
  return { type: Types.SET_GROUP_SELECTED, id: supplierGroupId }
}

export function ToggleEditGroupMode (open) {
  return { type: Types.TOGGLE_EDIT_FORM_GROUP, open: open || 'toggle' }
}

export function createGroup (formData) {
  return function (dispatch) {
    return CompanySocket.Supplier.createGroup(formData).then(function (result) {
      dispatch({ type: Types.GROUP_CREATED, supplierGroup: result.supplier_group })
      dispatch(selectGroupById(result.supplier_group.id))
      return result
    })
  }
}

export function updateGroup (formData) {
  return function (dispatch) {
    return CompanySocket.Supplier.updateGroup(formData).then(function (result) {
      dispatch({ type: Types.GROUP_UPDATED, supplierGroup: result.supplier_group })
      dispatch(selectGroupById(result.supplier_group.id))
      dispatch(ToggleEditGroupMode(false))
      return result
    })
  }
}

export function deleteGroup (formData) {
  return function (dispatch) {
    CompanySocket.Supplier.deleteGroup(formData, function (result) {
      dispatch({ type: Types.GROUP_DELETED, supplierGroup: result.supplier_group })
    })
  }
}

export function restoreGroup (formData) {
  return function (dispatch) {
    CompanySocket.Supplier.restoreGroup(formData, function (result) {
      dispatch({ type: Types.GROUP_CREATED, supplierGroup: result.supplier_group })
    })
  }
}

export function getGroups () {
  return function (dispatch) {
     return CompanySocket.Supplier.getGroups({}).then(function(result){
       dispatch({type: Types.SET_GROUP_LIST, supplierGroups: result.supplier_groups})
       return result
     })
  }
}

export function createSupplier(formData){
  return function(dispatch){
    return CompanySocket.Supplier.createSupplier(formData).then(function(result){
      dispatch({type: Types.SUPPLIER_CREATED, supplier: result.supplier})
    })
  }
}

export function updateSupplier (formData) {
  return function (dispatch) {
    return CompanySocket.Supplier.updateSupplier(formData).then(function (result) {
      dispatch({ type: Types.SUPPLIER_UPDATED, supplier: result.supplier })
      dispatch(closeUpdateSupplierModal())
      return result
    })
  }
}

export function enableSupplier (formData) {
  return function(dispatch){
    return CompanySocket.Supplier.updateSupplier({ id: formData.id, status: STATUS_ACTIVE }).then(function(result){
      dispatch({type: Types.SUPPLIER_UPDATED, supplier: result.supplier})
      return result
    })
  }
}

export function disableSupplier (formData) {
  return function(dispatch){
    return CompanySocket.Supplier.updateSupplier({ id: formData.id, status: STATUS_INACTIVE }).then(function(result){
      dispatch({type: Types.SUPPLIER_UPDATED, supplier: result.supplier})
      return result
    })
  }
}

export function deleteSupplier(formData) {
  return function (dispatch) {
    CompanySocket.Supplier.deleteSupplier(formData, function (result) {
      dispatch({ type: Types.SUPPLIER_DELETED, supplier: result.supplier })
      dispatch(setFlashLogDisplayIn(result.log, 5))
    })
  }
}

export function unassignSupplier(formData) {
  return function (dispatch) {
    CompanySocket.Supplier.unassignSupplier(formData, function (result) {
      dispatch({ type: Types.SUPPLIER_UNASSIGNED, supplier_id: result.supplier_id})
    })
  }
}

export function restoreSupplier (formData) {
  return function (dispatch) {
    CompanySocket.Supplier.restoreSupplier(formData, function (result) {
      dispatch({ type: Types.SUPPLIER_CREATED, supplier: result.supplier })
      dispatch(displayFlashLog(false))
    })
  }
}

export function getSuppliers (supplierGroupId) {
  return function (dispatch) {
    return CompanySocket.Supplier.getSuppliers({supplier_group_id: supplierGroupId}).then(function(result){
      dispatch({type: Types.SET_SUPPLIER_LIST, suppliers: result.suppliers})
      return result
    })
  }
}

export function openUpdateSupplierModal (formData) {
  return { type: Types.START_UPDATE_SUPPLIER, id: formData.id }
}

export function closeUpdateSupplierModal (formData) {
  return { type: Types.CANCEL_UPDATE_SUPPLIER }
}