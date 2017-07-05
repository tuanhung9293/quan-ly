'use strict'

import React, { PureComponent } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormControlSelect } from 'packages/oneui'
import * as Actions from '../actions'
import { WarehouseConfigurationReducer } from '../reducers/WarehouseConfigurationReducer'

class FormControlRoles extends PureComponent {
  static defaultProps = {
    name: 'role_id'
  }

  componentWillMount () {
    this.props.actions.joinRoom()
    this.props.actions.getWarehouses()
  }

  componentWillUnmount () {
    this.props.actions.leaveRoom()
  }

  render () {
    const { data, actions, ...rest } = this.props

    const options = data.roles.valueSeq().map(function (role) {
      return { value: role.id, label: role.name }
    }).toArray()

    return (
      <FormControlSelect options={options}
                         defaultValue={false}
                         {...rest} />
    )
  }
}

const FormControlRolesClass = connect(
  (state) => ({
    data: state[ WarehouseConfigurationReducer.store ]
  }),
  (dispatch) => ({
    actions: bindActionCreators(Actions, dispatch)
  })
)(FormControlWarehouse)

import ComponentRegistry from 'packages/api/ComponentRegistry'
ComponentRegistry.groupTo('Form', 'Roles', FormControlRolesClass, 'packages/access-rights/FormControlRoles')
export default FormControlRolesClass