'use strict'

import React, { PureComponent } from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormControlSelect } from 'packages/oneui'
import * as Actions from '../actions'
import { SupplierReducer } from '../reducers/SupplierReducer'

class FormControlSupplierGroup extends PureComponent {
  static defaultProps = {
    name: 'supplier_group_id'
  }

  componentWillMount () {
    this.props.actions.joinRoom()
    this.props.actions.getGroups()
  }

  componentWillUnmount () {
    this.props.actions.leaveRoom()
  }

  render () {
    const { data, actions, ...rest } = this.props

    const options = data.supplier_groups.valueSeq().map(function (supplierGroup) {
      return { value: supplierGroup.id, label: supplierGroup.name }
    }).toArray()

    return (
      <FormControlSelect options={options}
                         {...rest} />
    )
  }
}

const FormControlSupplierGroupClass = connect(
  (state) => ({
    data: state[ SupplierReducer.store ]
  }),
  (dispatch) => ({
    actions: bindActionCreators(Actions, dispatch)
  })
)(FormControlSupplierGroup)

import ComponentRegistry from 'packages/api/ComponentRegistry'
ComponentRegistry.groupTo('Form', 'Supplier', FormControlSupplierGroupClass, 'packages/supplier/FormControlSupplierGroupClass')
export default FormControlSupplierGroupClass