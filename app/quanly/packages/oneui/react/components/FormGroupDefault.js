'use strict'

import React, { PureComponent } from 'react'
import { injectIntl } from 'react-intl'
import {
  FormGroup as BootstrapFormGroup,
  Col
} from 'react-bootstrap'
import HelpIcon from './HelpIcon'

class FormGroupDefault extends PureComponent {
  render () {
    const formatMessage = this.props.intl.formatMessage
    const {
      formControl, formDecoration, validationState,
      groupCol,
      controlId,
      label,
      help, helpIcon,
      meta
    } = this.props

    const formGroup = (
      <BootstrapFormGroup controlId={controlId} validationState={validationState}>
        <label className='col-xs-12' htmlFor={controlId}>
          {label}
          {help && <HelpIcon className='margin-left-5' icon={helpIcon}>{help}</HelpIcon>}
        </label>
        <Col xs={12}>
          {formControl}
          {
            formDecoration.mode === 'input' && meta && meta.touched && meta.error &&
            <span className="help-block">{formatMessage(meta.error[ 0 ].intlMessage)}</span>
          }
        </Col>
      </BootstrapFormGroup>
    )

    if (groupCol) {
      return (
        <Col {...groupCol}>
          {formGroup}
        </Col>
      )
    }

    return (formGroup)
  }
}

export default injectIntl(FormGroupDefault)
