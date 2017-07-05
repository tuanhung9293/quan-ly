'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { defineMessages } from 'react-intl'
import { reduxForm } from 'redux-form'
import { Form } from 'packages/oneui'
import { FORM_CREATE_EMPLOYEE } from '../../lib/constants'

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
  create: {
    id: 'Form.create',
    defaultMessage: 'Create'
  },
  cancel: {
    id: 'Form.cancel',
    defaultMessage: 'Cancel'
  }
})

class EmployeeCreateForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  }
  static defaultProps = {}

  render () {
    const { onSubmit, ...rest } = this.props

    return (
      <Form columns={2}
            groupCol={{sm:5}}
            labelCol={{sm:4}}
            controlCol={{sm:8}}
            onSubmit={onSubmit}
            {...rest}>
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
        <Form.Actions create/>
        />
      </Form>
    )
  }
}

export default reduxForm({
  form: FORM_CREATE_EMPLOYEE
})(EmployeeCreateForm)
