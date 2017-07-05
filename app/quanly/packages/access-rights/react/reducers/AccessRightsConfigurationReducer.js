'use strict'

import * as ActionTypes from '../../lib/actionTypes'
import * as Constants from '../../lib/constants'
import { Reducer } from 'packages/api'
import { Map } from 'immutable'

class AccessRightsConfigurationReducerClass extends Reducer {
  store = 'AccessRightsConfiguration'

  initialState = {
    roles: Map(),
    loading: true,
    selected: null,
    tab: Constants.CONFIGURATION_TAB_SETTINGS,
    show_role_update_form: false
  }

  handlers = {
    [ ActionTypes.SET_LOADING ]: this.setLoading,
    [ ActionTypes.SELECT_TAB ]: this.selectTab,
    [ ActionTypes.SELECT_ROLE ]: this.selectRole,
    [ ActionTypes.TOGGLE_ROLE_UPDATE_FORM_EDIT_MODE ]: this.toggleRoleUpdateForm,
    [ ActionTypes.SET_ROLE_LIST ]: this.setRoleList,
    [ ActionTypes.ROLE_CREATED ]: this.onRoleCreated,
    [ ActionTypes.ROLE_UPDATED ]: this.onRoleUpdated,
    [ ActionTypes.ROLE_DELETED ]: this.onRoleDeleted,
  }

  setLoading (state, { loading }) {
    return {
      loading: new Boolean(loading).valueOf()
    }
  }

  selectTab (state, { tab }) {
    return {
      tab: tab
    }
  }

  selectRole (state, { id }) {
    if (!state.roles.has(id)) {
      return null
    }
    if (state.selected && state.selected.id === id) {
      return {
        selected: state.roles.get(id)
      }
    }
    return {
      selected: state.roles.get(id),
      show_role_update_form: false
    }
  }

  toggleRoleUpdateForm (state, { open }) {
    return this.toggleProperty(state, 'show_role_update_form', open)
  }

  setRoleList (state, { roles }) {
    return {
      roles: Reducer.Util.convertArrayToImmutableMap(roles, 'id')
    }
  }

  onRoleCreated (state, { role }) {
    return {
      roles: state.roles.set(role.id, role)
    }
  }

  onRoleUpdated (state, { role }) {
    return {
      roles: state.roles.set(role.id, role)
    }
  }

  onRoleDeleted (state, { role }) {
    var roles = state.roles.delete(role.id)
    if (state.selected !== null && state.selected.id === role.id) {
      return {
        selected: roles.first(),
        roles: roles,
        show_role_update_form: false
      }
    }

    return {
      roles: roles
    }
  }
}

export const AccessRightsConfigurationReducer = new AccessRightsConfigurationReducerClass()
export const ACCESS_RIGHTS_CONFIGURATION_STORE = AccessRightsConfigurationReducer.store
export default Reducer.createReducer(AccessRightsConfigurationReducer)
