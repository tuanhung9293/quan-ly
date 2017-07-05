'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { intlShape, defineMessages } from 'react-intl'
import { Modal, Button } from 'react-bootstrap'
import * as Constants from '../../lib/constants'
import SupplierUpdateForm from './SupplierUpdateForm'

const messages = defineMessages({
  title: {
    id: "SupplierUpdateModal.title",
    defaultMessage: "Update supplier"
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

const SupplierUpdateModal = function ({ intl, container, supplierData, onHide, onEnter, formSubmit }) {
  return (
    <Modal show={supplierData !== null}
           keyboard={true}
           restoreFocus={false}
           container={container}
           onEnter={() => onEnter(Constants.FORM_UPDATE_SUPPLIER, supplierData)}
           onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title>{intl.formatMessage(messages.title)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SupplierUpdateForm />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>{intl.formatMessage(messages.close)}</Button>
        <Button bsStyle='primary'
                onClick={() => formSubmit(Constants.FORM_UPDATE_SUPPLIER)}>
          {intl.formatMessage(messages.update)}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

SupplierUpdateModal.propTypes = {
  intl: intlShape,
  onEnter: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  //formSubmit: PropTypes.func.isRequired
}

export default SupplierUpdateModal