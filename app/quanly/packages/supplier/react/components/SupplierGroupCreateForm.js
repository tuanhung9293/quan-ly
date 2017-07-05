'use strict'

import React from 'react'
import {startSubmit, stopSubmit, reset, reduxForm} from 'redux-form'
import {intlShape, defineMessages} from 'react-intl'
import OneFieldFrom from '../../../uilib/OneFieldForm'
import {FORM_CREATE_SUPPLIER_GROUP} from '../../lib/constants'
import {createGroup} from '../actions'

const messages = defineMessages({
  namePlaceholder: {
    id: 'SupplierGroupCreateForm.name-placeholder',
    defaultMessage: 'Name of supplier group'
  }
})

const SupplierGroupCreateFormConfig = {
  form: FORM_CREATE_SUPPLIER_GROUP,
  onSubmit: function(formData, dispatch){
    dispatch(startSubmit(FORM_CREATE_SUPPLIER_GROUP))
    dispatch(createGroup(formData))
      .then(function(){
        dispatch(stopSubmit(FORM_CREATE_SUPPLIER_GROUP))
        dispatch(reset(FORM_CREATE_SUPPLIER_GROUP))
      })
      .catch(function(respond){
        dispatch(stopSubmit(FORM_CREATE_SUPPLIER_GROUP), respond.errors)
      })
  }
}

const SupplierGroupCreateForm = reduxForm(SupplierGroupCreateFormConfig)(({intl, ...rest}) => {
  return (
    <OneFieldFrom placeholder = {intl.formatMessage(messages.namePlaceholder)}
                  name="name"
                  {...rest}
    />
  )
})

SupplierGroupCreateForm.propTypes = {
  intl: intlShape
}

export default SupplierGroupCreateForm