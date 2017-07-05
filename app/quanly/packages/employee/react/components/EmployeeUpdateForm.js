'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { defineMessages } from 'react-intl'
import { Form } from 'packages/oneui'
import { reduxForm } from 'redux-form'
import { FORM_UPDATE_EMPLOYEE } from '../../lib/constants'

const messages = defineMessages({
  nameLabel: {
    id: 'EmployeeForm.name-label',
    defaultMessage: 'Name'
  },
  namePlaceholder: {
    id: 'EmployeeForm.name-placeholder',
    defaultMessage: 'Name of employee'
  },
  emailLabel: {
    id: 'EmployeeForm.email-label',
    defaultMessage: 'Email'
  },
  emailPlaceholder: {
    id: 'EmployeeForm.email-placeholder',
    defaultMessage: 'Email of this employee (unique)'
  },
  addressLabel: {
    id: 'EmployeeForm.address-label',
    defaultMessage: 'Address'
  },
  addressPlaceholder: {
    id: 'EmployeeForm.address-placeholder',
    defaultMessage: 'Address of this employee'
  },
  phoneLabel: {
    id: 'EmployeeForm.phone-label',
    defaultMessage: 'Phone'
  },
  phonePlaceholder: {
    id: 'EmployeeForm.phone-placeholder',
    defaultMessage: 'Phone number of this employee'
  },
  update: {
    id: 'Form.update',
    defaultMessage: 'Update'
  },
  cancel: {
    id: 'Form.cancel',
    defaultMessage: 'Cancel'
  }
})

class EmployeeUpdateForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  }
  static defaultProps = {
    showActions: true
  }

  render () {
    const { showActions, onSubmit, ...rest } = this.props

    var formGroupStyle = {}
    if (!showActions) {
      formGroupStyle.display = 'none'
    }

    return (
      <Form onSubmit={onSubmit} {...rest}>
        <Form.TextBox name='name'
                      label={messages.nameLabel}
                      placeholder={messages.namePlaceholder}
        />
        <Form.TextBox name='email'
                      label={messages.emailLabel}
                      placeholder={messages.emailPlaceholder}
        />
        <Form.TextBox name='phone'
                      label={messages.phoneLabel}
                      placeholder={messages.phonePlaceholder}
        />
        <Form.TextBox name='address'
                      label={messages.addressLabel}
                      placeholder={messages.addressPlaceholder}
        />
        <Form.Actions update style={formGroupStyle}/>
      </Form>
    )
  }
}

export default reduxForm({
  form: FORM_UPDATE_EMPLOYEE
})(EmployeeUpdateForm)