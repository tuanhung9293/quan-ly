'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { startSubmit, stopSubmit, reduxForm } from 'redux-form'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import { Form, Field } from 'packages/oneui'
import { FORM_UPDATE_WAREHOUSE } from '../../lib/constants'
import { updateWarehouse } from '../actions'

const messages = defineMessages({
  nameLabel: {
    id: 'WarehouseUpdateForm.name-label',
    defaultMessage: 'Name'
  },
  namePlaceholder: {
    id: 'WarehouseUpdateForm.name-placeholder',
    defaultMessage: 'Name of warehouse'
  },
  emailLabel: {
    id: 'WarehouseUpdateForm.email-label',
    defaultMessage: 'Email'
  },
  emailPlaceholder: {
    id: 'WarehouseUpdateForm.email-placeholder',
    defaultMessage: 'Email of this warehouse'
  },
  addressLabel: {
    id: 'WarehouseUpdateForm.address-label',
    defaultMessage: 'Address'
  },
  addressPlaceholder: {
    id: 'WarehouseUpdateForm.address-placeholder',
    defaultMessage: 'Address of this warehouse'
  },
  phoneLabel: {
    id: 'WarehouseUpdateForm.phone-label',
    defaultMessage: 'Phone'
  },
  phonePlaceholder: {
    id: 'WarehouseUpdateForm.phone-placeholder',
    defaultMessage: 'Phone number of this warehouse'
  }
})

const WarehouseUpdateFormConfig = {
  form: FORM_UPDATE_WAREHOUSE,
  onSubmit: function (formData, dispatch) {
    dispatch(startSubmit(FORM_UPDATE_WAREHOUSE))
    dispatch(updateWarehouse(formData))
      .then(function () {
        dispatch(stopSubmit(FORM_UPDATE_WAREHOUSE))
      })
      .catch(function (respond) {
        dispatch(stopSubmit(FORM_UPDATE_WAREHOUSE, respond.errors))
      })
  }
}

const WarehouseUpdateForm = reduxForm(WarehouseUpdateFormConfig)(
  function ({ warehouse, editMode, onCancel, ...rest }) {
    return (
      <Form data={warehouse}
            mode={editMode ? 'input' : 'display'}
            {...rest}
      >
        <Form.Hidden name='id'/>
        <Form.Text name='name'
                   label={messages.nameLabel}
                   placeholder={messages.namePlaceholder}
        />
        <Form.Text name='email'
                   label={messages.emailLabel}
                   placeholder={messages.emailPlaceholder}
        />
        <Form.Text name='phone'
                   label={messages.phoneLabel}
                   placeholder={messages.phonePlaceholder}
        />
        <Form.Text name='address'
                   label={messages.addressLabel}
                   placeholder={messages.addressPlaceholder}
        />
        <Form.Buttons save cancel={onCancel}/>
      </Form>
    )
  }
)

WarehouseUpdateForm.propTypes = {
  onCancel: PropTypes.func.isRequired
}
export default WarehouseUpdateForm
