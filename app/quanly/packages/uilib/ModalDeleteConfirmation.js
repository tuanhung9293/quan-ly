'use strict'

import React from 'react'
import { Modal } from 'react-bootstrap'
import { intlShape, injectIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  title: {
    id: 'ModalDeleteConfirmation.title',
    defaultMessage: 'Confirmation'
  }
})

class ModalDeleteConfirmation extends React.Component {
  static propTypes = {
    intl: intlShape
  }

  static defaultProps = {

  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { title } = this.props

    return (
      <Modal>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.children}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default injectIntl(ModalDeleteConfirmation)