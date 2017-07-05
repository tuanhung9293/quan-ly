'use strict'

import * as ActionTypes from '../../lib/actionTypes'
import { Reducer } from 'packages/api'
import { Map } from 'immutable'
import { SUPPLIER_TAB_SETTINGS } from '../../lib/constants'

class SupplierReducerClass extends Reducer {
  store = 'Supplier'

  initialState = {
    supplier_groups: Map(),
    suppliers: Map(),
    selected_group: null,
    supplier_loading: true,
    group_loading: true,
    show_update_group_form: false,
    tab: SUPPLIER_TAB_SETTINGS,
    updating_supplier: null
  }

  handlers = {
    [ ActionTypes.SET_GROUP_LIST ]: this.setGroupsList,
    [ ActionTypes.SET_GROUP_SELECTED ]: this.setGroupSelected,
    [ ActionTypes.TOGGLE_EDIT_FORM_GROUP ]: this.toggleEditGroupForm,
    [ ActionTypes.GROUP_CREATED ]: this.onGroupCreated,
    [ ActionTypes.GROUP_UPDATED ]: this.onGroupUpdated,
    [ ActionTypes.GROUP_DELETED ]: this.onGroupDeleted,
    [ ActionTypes.SUPPLIER_CREATED ]: this.onSupplierCreated,
    [ActionTypes.SET_SUPPLIER_LIST]: this.setSupplierList,
    [ActionTypes.SUPPLIER_UPDATED]: this.onSupplierUpdated,
    [ActionTypes.SUPPLIER_DELETED]: this.onSupplierDeleted,
    [ActionTypes.SUPPLIER_UNASSIGNED]: this.onSupplierUnassigned,
    [ ActionTypes.SELECT_TAB ]: this.selectTab,
    [ActionTypes.START_UPDATE_SUPPLIER]: this.onStartUpdateSupplier,
    [ActionTypes.CANCEL_UPDATE_SUPPLIER]: this.onCancelUpdateSupplier
  }

  setGroupsList (state, { supplierGroups }) {
    supplierGroups.unshift({ id: 'all', name: "All" })
    var supplierGroupsMaps = Reducer.Util.convertArrayToImmutableMap(supplierGroups, 'id')
    return {
      supplier_groups: supplierGroupsMaps,
      group_loading: false
    }
  }

  setGroupSelected (state, { id }) {
    if (!state.supplier_groups.has(id)) {
      return null
    }
    if (state.selected_group && state.selected_group.id === id) {
      return {
        selected_group: state.supplier_groups.get(id)
      }
    }
    return {
      selected_group: state.supplier_groups.get(id),
      show_update_group_form: false
    }
  }

  toggleEditGroupForm (state, { open }) {
    return this.toggleProperty(state, 'show_update_group_form', open)
  }

  onGroupCreated (state, { supplierGroup }) {
    return {
      supplier_groups: state.supplier_groups.set(supplierGroup.id, supplierGroup),
    }
  }

  onGroupUpdated (state, { supplierGroup }) {
    var supplier_groups = state.supplier_groups.set(supplierGroup.id, supplierGroup)
    return {
      supplier_groups: supplier_groups
    }
  }

  onGroupDeleted (state, { supplierGroup }) {
    var supplier_groups = state.supplier_groups.delete(supplierGroup.id)
    if (state.selected_group !== null && state.selected_group.id === supplierGroup.id) {
      return {
        selected_group: supplier_groups.first(),
        supplier_groups: supplier_groups,
        show_role_update_form: false
      }
    }

    return {
      supplier_groups: supplier_groups
    }
  }

  onSupplierCreated (state, { supplier }) {
    return {
      suppliers: state.suppliers.set(supplier.id, supplier)
    }
  }

  onSupplierUpdated (state, { supplier }) {
    var suppliers = state.suppliers.set(supplier.id, supplier)

    if (state.updating_supplier !== null && state.updating_supplier.id === supplier.id) {
      return {
        updating_supplier: supplier,
        suppliers: suppliers
      }
    }

    return {
      suppliers: suppliers
    }
  }

  onSupplierDeleted (state, { supplier }) {
    var suppliers = state.suppliers.delete(supplier.id)
    if (state.updating_supplier !== null && state.updating_supplier.id === supplier.id) {
      return {
        suppliers: suppliers,
        updating_supplier: null
      }
    }

    return {
      suppliers: suppliers
    }
  }

  selectTab (state, { tab }) {
    return {
      tab: tab
    }
  }

  onSupplierUnassigned (state, { supplier_id }) {
    var suppliers = state.suppliers.delete(supplier_id)
    if (state.updating_supplier !== null && state.updating_supplier.id === supplier_id) {
      return {
        suppliers: suppliers,
        updating_supplier: null
      }
    }

    return {
      suppliers: suppliers
    }
  }

  onStartUpdateSupplier (state, action) {
    return {
      updating_supplier: state.suppliers.get(action.id)
    }
  }

  onCancelUpdateSupplier (state, { supplier }) {
    return {
      updating_supplier: null
    }
  }

  setSupplierList (state, { suppliers }) {
    var suppliersMap = Reducer.Util.convertArrayToImmutableMap(suppliers, 'id')
    return {
      suppliers: suppliersMap,
      supplier_loading: false
    }
  }
}

export const SupplierReducer = new SupplierReducerClass()
export const SUPPLIER_STORE = SupplierReducer.store
export default Reducer.createReducer(SupplierReducer)