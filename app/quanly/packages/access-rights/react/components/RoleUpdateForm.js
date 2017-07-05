'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { startSubmit, stopSubmit, reduxForm } from 'redux-form'
import { defineMessages } from 'react-intl'
import { Form } from 'packages/oneui'
import { FORM_UPDATE_ROLE } from '../../lib/constants'
import { updateRole } from '../actions'

const messages = defineMessages({
  nameLabel: {
    id: 'RoleUpdateForm.name_label',
    defaultMessage: 'Name'
  },
  namePlaceholder: {
    id: 'RoleUpdateForm.name_placeholder',
    defaultMessage: 'Name of warehouse'
  },
  isAdminLabel: {
    id: 'RoleUpdateForm.is_admin_label',
    defaultMessage: 'Admin Role'
  },
  isAdminHelpInfo: {
    id: 'RoleUpdateForm.is_admin_help_info',
    defaultMessage: 'Employees in this role are administrators, they can do everything without any restriction'
  }
})

const RoleUpdateFormConfig = {
  form: FORM_UPDATE_ROLE,
  onSubmit: function (formData, dispatch) {
    dispatch(startSubmit(FORM_UPDATE_ROLE))
    dispatch(updateRole(formData))
      .then(function () {
        dispatch(stopSubmit(FORM_UPDATE_ROLE))
      })
      .catch(function (respond) {
        dispatch(stopSubmit(FORM_UPDATE_ROLE, respond.errors))
      })
  }
}

const RoleUpdateForm = reduxForm(RoleUpdateFormConfig)(
  function ({ role, editMode, onCancel, ...rest }) {
    console.log(role)
    return (
      <Form data={role}
            mode={editMode ? 'input' : 'display'}
            {...rest}
      >
        <Form.Hidden name='id'/>
        <Form.Text name='name'
                   label={messages.nameLabel}
                   placeholder={messages.namePlaceholder}
        />
        <Form.Checkbox name='is_admin'
                       label={messages.isAdminLabel}
                       help={messages.isAdminHelpInfo}
                       switch
        />
        <Form.Actions save cancel={onCancel}/>
      </Form>
    )
  }
)
RoleUpdateForm.propTypes = {
  onCancel: PropTypes.func.isRequired
}
export default RoleUpdateForm
