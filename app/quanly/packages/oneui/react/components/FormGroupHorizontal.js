'use strict'

import React, { PureComponent } from 'react'
import { injectIntl } from 'react-intl'
import {
  FormGroup as BootstrapFormGroup,
  ControlLabel as BootstrapControlLabel,
  Col
} from 'react-bootstrap'
import HelpIcon from './HelpIcon'

class FormGroupHorizontal extends PureComponent {
  render () {
    const formatMessage = this.props.intl.formatMessage
    const {
      intl, reduxForm,
      formControl, formDecoration, validationState,
      groupCol, labelCol, controlCol,
      controlId,
      label,
      help, helpIcon,
      meta,
      ...rest
    } = this.props

    const formGroup = (
      <BootstrapFormGroup controlId={controlId} validationState={validationState} {...rest}>
        <Col {...labelCol} componentClass={BootstrapControlLabel}>
          {label}
          {help && <HelpIcon className='margin-left-5' icon={helpIcon}>{help}</HelpIcon>}
        </Col>
        <Col {...controlCol}>
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
        <Col {...groupCol}>{formGroup}</Col>
      )
    }

    return (formGroup)
  }
}

export default injectIntl(FormGroupHorizontal)
