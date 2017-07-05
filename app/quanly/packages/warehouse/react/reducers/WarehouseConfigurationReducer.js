'use strict'

import * as ActionTypes from '../../lib/actionTypes'
import { Reducer } from 'packages/api'
import { Map } from 'immutable'

class WarehouseConfigurationReducerClass extends Reducer {
  store = 'WarehouseConfiguration'

  initialState = {
    warehouses: Map(),
    selected: null,
    loading: true,
    show_update_form: false
  }

  handlers = {
    [ ActionTypes.SET_LOADING ]: this.setLoading,
    [ ActionTypes.SET_WAREHOUSE_LIST ]: this.setWarehousesList,
    [ ActionTypes.SET_SELECTED ]: this.setSelected,
    [ ActionTypes.TOGGLE_EDIT_FORM ]: this.toggleEditForm,
    [ ActionTypes.WAREHOUSE_CREATED ]: this.onWarehouseCreated,
    [ ActionTypes.WAREHOUSE_UPDATED ]: this.onWarehouseUpdated,
    [ ActionTypes.WAREHOUSE_DELETED ]: this.onWarehouseDeleted,
  }

  setLoading (state, { loading }) {
    return {
      loading: new Boolean(loading).valueOf()
    }
  }

  setWarehousesList (state, { warehouses }) {
    return {
      warehouses: Reducer.Util.convertArrayToImmutableMap(warehouses, 'id')
    }
  }

  setSelected (state, { id }) {
    if (!state.warehouses.has(id)) {
      return null
    }
    if (state.selected && state.selected.id === id) {
      return {
        selected: state.warehouses.get(id)
      }
    }
    return {
      selected: state.warehouses.get(id),
      show_update_form: false
    }
  }

  toggleEditForm (state, { open }) {
    return this.toggleProperty(state, 'show_update_form', open)
  }

  onWarehouseCreated (state, { warehouse }) {
    return {
      warehouses: state.warehouses.set(warehouse.id, warehouse)
    }
  }

  onWarehouseUpdated (state, { warehouse }) {
    var warehouses = state.warehouses.set(warehouse.id, warehouse)
    return {
      warehouses: warehouses
    }
  }

  onWarehouseDeleted (state, { warehouse }) {
    var warehouses = state.warehouses.delete(warehouse.id)
    if (state.selected !== null && state.selected.id === warehouse.id) {
      return {
        selected: warehouses.first(),
        warehouses: warehouses,
        show_update_form: false
      }
    }

    return {
      warehouses: warehouses
    }
  }
}

export const WarehouseConfigurationReducer = new WarehouseConfigurationReducerClass()
export const WAREHOUSE_CONFIGURATION_STORE = WarehouseConfigurationReducer.store
export default Reducer.createReducer(WarehouseConfigurationReducer)
