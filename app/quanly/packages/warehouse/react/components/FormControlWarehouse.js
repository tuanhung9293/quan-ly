'use strict'

import React, { PureComponent } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormControlSelect } from 'packages/oneui'
import * as Actions from '../actions'
import { WarehouseConfigurationReducer } from '../reducers/WarehouseConfigurationReducer'

class FormControlWarehouse extends PureComponent {
  static defaultProps = {
    name: 'warehouse_id'
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

    const options = data.warehouses.valueSeq().map(function (warehouse) {
      return { value: warehouse.id, label: warehouse.name }
    }).toArray()

    return (
      <FormControlSelect options={options}
                         defaultValue={false}
                         {...rest} />
    )
  }
}

const FormControlWarehouseClass = connect(
  (state) => ({
    data: state[ WarehouseConfigurationReducer.store ]
  }),
  (dispatch) => ({
    actions: bindActionCreators(Actions, dispatch)
  })
)(FormControlWarehouse)

import ComponentRegistry from 'packages/api/ComponentRegistry'
ComponentRegistry.groupTo('Form', 'Warehouse', FormControlWarehouseClass, 'packages/warehouse/FormControlWarehouse')
export default FormControlWarehouseClass