'use strict'

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { Field as ReduxField } from 'redux-form'
import FormControl from './FormControl'
import FormGroup from './FormGroup'
import Lodash from 'lodash'

class Field extends PureComponent {
  static propTypes = {
    intl: intlShape,
    name: PropTypes.string.isRequired,
    formControl: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    displayControl: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
    component: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]).isRequired,
  }

  static defaultProps = {
    label: '',
    placeholder: '',
    help: undefined,
    helpIcon: 'fa fa-info-circle',
    labelCol: undefined,
    controlCol: undefined,
    groupCol: undefined,
    formControl: FormControl,
    displayControl: 'div',
    component: FormGroup
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    var { label, help, placeholder, ...rest } = this.props

    rest.label = Lodash.isPlainObject(label) ? formatMessage(label) : label
    rest.help = Lodash.isPlainObject(help) ? formatMessage(help) : help
    rest.placeholder = Lodash.isPlainObject(placeholder) ? formatMessage(placeholder) : placeholder
    return (
      <ReduxField {...rest} />
    )
  }
}

export default injectIntl(Field)
