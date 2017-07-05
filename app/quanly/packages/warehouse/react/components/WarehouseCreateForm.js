'use strict'

import React from 'react'
import { startSubmit, stopSubmit, reset, reduxForm } from 'redux-form'
import { intlShape, defineMessages } from 'react-intl'
import OneFieldForm from '../../../uilib/OneFieldForm'
import { FORM_CREATE_WAREHOUSE } from '../../lib/constants'
import { createWarehouse } from '../actions'

const messages = defineMessages({
  namePlaceholder: {
    id: 'WarehouseCreateForm.name-placeholder',
    defaultMessage: 'Name of warehouse'
  }
})

const WarehouseCreateFormConfig = {
  form: FORM_CREATE_WAREHOUSE,
  onSubmit: function (formData, dispatch) {
    dispatch(startSubmit(FORM_CREATE_WAREHOUSE))
    dispatch(createWarehouse(formData))
      .then(function () {
        dispatch(stopSubmit(FORM_CREATE_WAREHOUSE))
        dispatch(reset(FORM_CREATE_WAREHOUSE))
      })
      .catch(function (respond) {
        dispatch(stopSubmit(FORM_CREATE_WAREHOUSE, respond.errors))
      })
  }
}

const WarehouseCreateForm = reduxForm(WarehouseCreateFormConfig)(({ intl, ...rest }) => {
  return (
    <OneFieldForm placeholder={intl.formatMessage(messages.namePlaceholder)}
                  name='name'
                  {...rest}
    />
  )
})
WarehouseCreateForm.propTypes = {
  intl: intlShape
}
export default WarehouseCreateForm
