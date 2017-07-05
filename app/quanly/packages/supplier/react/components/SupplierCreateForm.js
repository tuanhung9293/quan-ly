'use strict'

import React from 'react'
import { reduxForm, startSubmit, stopSubmit, reset } from 'redux-form'
import { Form } from 'packages/oneui'
import { defineMessages, intlShape } from 'react-intl'
import { FORM_CREATE_SUPPLIER } from '../../lib/constants'
import { createSupplier } from '../actions'
import FormControlSupplierGroup from './FormControlSupplierGroup'

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

const SupplierCreateFormConfig = {
  form: FORM_CREATE_SUPPLIER,
  onSubmit: function (formData, dispatch) {
    dispatch(startSubmit(FORM_CREATE_SUPPLIER))
    dispatch(createSupplier(formData))
      .then(function () {
        dispatch(stopSubmit(FORM_CREATE_SUPPLIER))
        dispatch(reset(FORM_CREATE_SUPPLIER))
      })
      .catch(function (respond) {
        dispatch(stopSubmit(FORM_CREATE_SUPPLIER), respond.errors)
      })
  }
}

const SupplierCreateForm = reduxForm(SupplierCreateFormConfig)(({ intl, ...rest }) => {
  return (
    <Form {...rest}
          columns={2}
          groupCol={{ sm: 6 }}
          labelCol={{ sm: 4 }}
          controlCol={{ sm: 8 }}>
      <FormControlSupplierGroup />
      <Form.TextBox name="name"
                    label={messages.nameLabel}
                    placeholder={messages.namePlaceholder}/>
      <Form.TextBox name="email"
                    label={messages.emailLabel}
                    placeholder={messages.emailPlaceholder}/>
      <Form.TextBox name="phone"
                    label={messages.phoneLabel}
                    placeholder={messages.phonePlaceholder}/>
      <Form.TextBox name="address"
                    label={messages.addressLabel}
                    placeholder={messages.addressPlaceholder}/>
      <Form.Hidden name="id"/>
      <Form.Actions create/>
    </Form>
  )
})
SupplierCreateForm.propTypes = { intl: intlShape }
export default SupplierCreateForm