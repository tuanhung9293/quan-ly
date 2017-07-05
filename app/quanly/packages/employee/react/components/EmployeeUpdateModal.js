'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import { Modal, Button } from 'react-bootstrap'
import * as Constants from '../../lib/constants'
import EmployeeUpdateForm from './EmployeeUpdateForm'

import { initialize as formInitialize, submit as formSubmit } from 'redux-form'

const messages = defineMessages({
  title: {
    id: 'EmployeeUpdateModal.title',
    defaultMessage: 'Update employee'
  },
  update: {
    id: 'Form.update',
    defaultMessage: 'Update'
  },
  close: {
    id: 'Form.close',
    defaultMessage: 'Close'
  }
})

class EmployeeUpdateModal extends Component {
  static propTypes = {
    intl: intlShape,
    onEnter: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    formSubmit: PropTypes.func.isRequired
  }
  static defaultProps = {}

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { container, employeeData, onHide, onEnter, onSubmit, formSubmit } = this.props

    return (
      <Modal show={employeeData !== null}
             keyboard={true}
             restoreFocus={false}
             container={container}
             onEnter={() => onEnter(Constants.FORM_UPDATE_EMPLOYEE, employeeData)}
             onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title>{formatMessage(messages.title)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmployeeUpdateForm showActions={false} onSubmit={onSubmit}/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>{formatMessage(messages.close)}</Button>
          <Button bsStyle='primary'
                  onClick={() => formSubmit(Constants.FORM_UPDATE_EMPLOYEE)}>
            {formatMessage(messages.update)}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default injectIntl(EmployeeUpdateModal)
