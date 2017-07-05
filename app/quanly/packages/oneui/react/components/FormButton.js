'use strict'

import React, { PureComponent } from 'react'
import { intlShape, injectIntl } from 'react-intl'
import Classnames from 'classnames'
import Lodash from 'lodash'

class FormButton extends PureComponent {
  static propTypes = {
    intl: intlShape
  }

  static defaultProps = {
    text: 'Submit',
    displayLoader: true,
    loaderIcon: 'fa fa-spinner fa-spin',
    type: 'submit',
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    var {
      intl,
      formDecoration,
      reduxForm,
      text,
      displayLoader,
      loaderIcon,
      className,
      ...rest
    } = this.props

    var defaultClassNames = {
      'btn': true,
      'btn-primary': rest.type === 'submit',
      'btn-default': rest.type !== 'submit'
    }

    if (displayLoader && rest.type !== 'submit') {
      displayLoader = false
    }

    if (displayLoader && reduxForm.submitting) {
      text = (<i className={loaderIcon}></i>)
      rest.disabled = true
    } else {
      text = Lodash.isPlainObject(text) ? formatMessage(text) : text
    }
    return (
      <button className={Classnames(defaultClassNames, className)} {...rest}>{text}</button>
    )
  }
}

const FormButtonClass = injectIntl(FormButton)
import ComponentRegistry from '../../../api/ComponentRegistry'
ComponentRegistry.groupTo('Form', 'Button', FormButton, 'packages/oneui/FormButton')
ComponentRegistry.groupTo('Form', 'Action', FormButton, 'packages/oneui/FormButton')

export default FormButtonClass
