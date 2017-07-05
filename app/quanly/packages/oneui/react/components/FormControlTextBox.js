'use strict'

import React, { PureComponent } from 'react'
import Field from './Field'

class FormControlTextBox extends PureComponent {
  static defaultProps = {
    type: 'text'
  }

  render () {
    return (
      <Field {...this.props} />
    )
  }
}

import ComponentRegistry from '../../../api/ComponentRegistry'
ComponentRegistry.groupTo('Form', 'Text', FormControlTextBox, 'packages/oneui/FormControlTextBox')
ComponentRegistry.groupTo('Form', 'TextBox', FormControlTextBox, 'packages/oneui/FormControlTextBox')
export default FormControlTextBox
