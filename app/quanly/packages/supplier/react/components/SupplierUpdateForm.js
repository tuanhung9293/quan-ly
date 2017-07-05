'use strict'

import React, { Component } from 'react'
import { startSubmit, stopSubmit, reduxForm } from 'redux-form'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import { Form } from 'packages/oneui'
import { FORM_UPDATE_SUPPLIER } from '../../lib/constants'
import { updateSupplier } from '../actions'

const messages = defineMessages({
  nameLabel: {
    id: 'SupplierForm.name-label',
    defaultMessage: 'Name'
  },
  namePlaceholder: {
    id: 'SupplierForm.name-placeholder',
    defaultMessage: 'Name of this product (required)'
  },

  emailLabel: {
    id: 'SupplierForm.email-label',
    defaultMessage: 'Email'
  },
  emailPlaceholder: {
    id: 'SupplierForm.email-placeholder',
    defaultMessage: 'Email of this supplier (required)'
  },

  phoneLabel: {
    id: 'SupplierForm.phone-label',
    defaultMessage: 'Phone'
  },
  phonePlaceholder: {
    id: 'SupplierForm.phone-placeholder',
    defaultMessage: 'Phone of this supplier (required)'
  },

  addressLabel: {
    id: 'SupplierForm.address-label',
    defaultMessage: 'Address'
  },
  addressPlaceholder: {
    id: 'SupplierForm.address-placeholder',
    defaultMessage: 'Address of this product'
  }
})

const SupplierUpdateFormConfig = {
  form: FORM_UPDATE_SUPPLIER,
  onSubmit: function (formData, dispatch) {
    dispatch(startSubmit(FORM_UPDATE_SUPPLIER))
    dispatch(updateSupplier(formData))
      .then(function () {
        dispatch(stopSubmit(FORM_UPDATE_SUPPLIER))
      })
      .catch(function (respond) {
        dispatch(stopSubmit(FORM_UPDATE_SUPPLIER, respond.errors))
      })
  }
}

const SupplierUpdateForm = reduxForm(SupplierUpdateFormConfig)(function ({ supplier, showActions, ...rest }) {
    var formGroupStyle = {}
    if (!showActions) {
      formGroupStyle.display = 'none'
    }
    return (
      <Form data={supplier}
            {...rest}>
        <Form.Hidden name='id'/>
        <Form.TextBox name="name"
                      label={messages.nameLabel}
                      placeholder={messages.namePlaceholder}
        />
        <Form.TextBox name="email"
                      label={messages.emailLabel}
                      placeholder={messages.emailPlaceholder}
        />
        <Form.TextBox name="phone"
                      label={messages.phoneLabel}
                      placeholder={messages.phonePlaceholder}
        />
        <Form.TextBox name="address"
                      label={messages.addressLabel}
                      placeholder={messages.addressPlaceholder}
        />
        <Form.Actions update style={formGroupStyle}/>
      </Form>
    )
  }
)

SupplierUpdateForm.propTypes = {
  intl: intlShape
}
SupplierUpdateForm.defaultProps = {
  showActions: false
}

export default SupplierUpdateForm