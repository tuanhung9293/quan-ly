'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { startSubmit, stopSubmit, reduxForm } from 'redux-form'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import { Form, Field } from 'packages/oneui'
import { FORM_UPDATE_SUPPLIER_GROUP } from '../../lib/constants'
import { updateGroup } from '../actions'

const messages = defineMessages({
  nameLabel: {
    id: 'SupplierGroupUpdateForm.group-name-label',
    defaultMessage: 'Name'
  },
  namePlaceholder: {
    id: 'SupplierGroupUpdateForm.group-name-placeholder',
    defaultMessage: 'Name of supplier group'
  }
})

const SupplierGroupUpdateFormConfig = {
  form: FORM_UPDATE_SUPPLIER_GROUP,
  onSubmit: function (formData, dispatch) {
    dispatch(startSubmit(FORM_UPDATE_SUPPLIER_GROUP))
    dispatch(updateGroup(formData))
      .then(function () {
        dispatch(stopSubmit(FORM_UPDATE_SUPPLIER_GROUP))
      })
      .catch(function (respond) {
        dispatch(stopSubmit(FORM_UPDATE_SUPPLIER_GROUP, respond.errors))
      })
  }
}

const SupplierGroupUpdateForm = reduxForm(SupplierGroupUpdateFormConfig)(
  function ({ supplierGroup, editMode, onCancel, ...rest }) {
    return (
      <Form data={supplierGroup}
            mode={editMode ? 'input' : 'display'}
            {...rest}
      >
        <Form.Hidden name='id'/>
        <Form.Text name='name'
                   label={messages.nameLabel}
                   placeholder={messages.namePlaceholder}
        />
        <Form.Buttons save cancel={onCancel}/>
      </Form>
    )
  }
)

SupplierGroupUpdateForm.propTypes = {
  onCancel: PropTypes.func.isRequired
}
export default SupplierGroupUpdateForm
