'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { startSubmit, stopSubmit, reset, reduxForm } from 'redux-form'
import { intlShape, defineMessages } from 'react-intl'
import { FORM_CREATE_ROLE } from '../../lib/constants'
import OneFieldForm from '../../../uilib/OneFieldForm'
import { createRole } from '../actions'

const messages = defineMessages({
  namePlaceholder: {
    id: 'RoleCreateForm.name-placeholder',
    defaultMessage: 'Name of role'
  }
})

const RoleCreateFormConfig = {
  form: FORM_CREATE_ROLE,
  onSubmit: function (formData, dispatch) {
    dispatch(startSubmit(FORM_CREATE_ROLE))
    dispatch(createRole(formData))
      .then(function () {
        dispatch(stopSubmit(FORM_CREATE_ROLE))
        dispatch(reset(FORM_CREATE_ROLE))
      })
      .catch(function (respond) {
        dispatch(stopSubmit(FORM_CREATE_ROLE, respond.errors))
      })
  }
}

const RoleCreateForm = reduxForm(RoleCreateFormConfig)(({ intl, ...rest }) => {
  return (
    <OneFieldForm placeholder={intl.formatMessage(messages.namePlaceholder)}
                  name='name'
                  {...rest}
    />
  )
})

RoleCreateForm.propTypes = {
  intl: intlShape
}

export default RoleCreateForm
