'use strict'

import { CompanySocket } from '../../api/CompanySocket'
import * as Types from '../lib/actionTypes'
import { setFlashLogDisplayIn, displayFlashLog } from '../../log'

export function joinRoom () {
  return function (dispatch) {
    return CompanySocket.Warehouse.join()
      .onCreated(function (warehouse) {
        dispatch({ type: Types.WAREHOUSE_CREATED, warehouse })
      })
      .onUpdated(function (warehouse) {
        dispatch({ type: Types.WAREHOUSE_UPDATED, warehouse })
      })
      .onDeleted(function (warehouse) {
        dispatch({ type: Types.WAREHOUSE_DELETED, warehouse })
      })
  }
}

export function leaveRoom () {
  return function (dispatch) {
    return CompanySocket.Warehouse.leave()
  }
}

export function setLoading (loading) {
  return { type: Types.SET_LOADING, loading }
}

export function selectWarehouseById (warehouseId) {
  return { type: Types.SET_SELECTED, id: warehouseId }
}

export function toggleEditMode (open) {
  return { type: Types.TOGGLE_EDIT_FORM, open: open || 'toggle' }
}

export function createWarehouse (formData) {
  return function (dispatch) {
    return CompanySocket.Warehouse.createWarehouse(formData).then(function (result) {
      dispatch({ type: Types.WAREHOUSE_CREATED, warehouse: result.warehouse })
      dispatch(selectWarehouseById(result.warehouse.id))
      dispatch(toggleEditMode(true))
      return result
    })
  }
}

export function updateWarehouse (formData) {
  return function (dispatch) {
    return CompanySocket.Warehouse.updateWarehouse(formData).then(function (result) {
      dispatch({ type: Types.WAREHOUSE_UPDATED, warehouse: result.warehouse })
      dispatch(selectWarehouseById(result.warehouse.id))
      dispatch(toggleEditMode(false))
      return result
    })
  }
}

export function deleteWarehouse (formData) {
  return function (dispatch) {
    CompanySocket.Warehouse.deleteWarehouse(formData, function (result) {
      dispatch({ type: Types.WAREHOUSE_DELETED, warehouse: result.warehouse })
      dispatch(setFlashLogDisplayIn(result.log, 5))
    })
  }
}

export function restoreWarehouse (formData) {
  return function (dispatch) {
    CompanySocket.Warehouse.restoreWarehouse(formData, function (result) {
      dispatch({ type: Types.WAREHOUSE_CREATED, warehouse: result.warehouse })
      dispatch(displayFlashLog(false))
    })
  }
}

export function getWarehouses () {
  return function (dispatch) {
    return CompanySocket.Warehouse.getWarehouses({}).then(function (result) {
      dispatch({ type: Types.SET_WAREHOUSE_LIST, warehouses: result.warehouses })
      return result
    })
  }
}
