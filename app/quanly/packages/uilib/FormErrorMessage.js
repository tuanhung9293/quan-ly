'use strict'

import React from 'react'
import { intlShape, injectIntl, defineMessages } from 'react-intl'
import { isString, isObject } from 'lodash'
import classnames from 'classnames'

const messages = defineMessages({
  defaultErrorMessage: {
    id: 'FormErrorMessage.default-error-message',
    defaultMessage: 'Unknown error'
  }
})

class FormErrorMessage extends React.Component {
  static propTypes = {
    intl: intlShape
  }

  static defaultProps = {
    component: 'p',
    className: 'text-danger',
    error: false
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { component: Component, className, error } = this.props

    var errorMessage
    var style = {}
    if (error) {
      if (isString(error)) {
        errorMessage = error
      } else if (isObject(error)) {
        errorMessage = formatMessage(error)
      }
    } else {
      style = { display: 'none' }
    }

    return (
      <Component className={classnames('form-error-message', className)} style={style}>{errorMessage}</Component>
    )
  }
}

export default injectIntl(FormErrorMessage)
