'use strict'

import React, { PureComponent } from 'react'
import { Field as ReduxField } from 'redux-form'

class FormControlHidden extends PureComponent {
  static defaultProps = {
    type: 'hidden'
  }

  render () {
    const { formDecoration, reduxForm, value, ...rest } = this.props

    function render ({ input }) {
      if (typeof value !== 'undefined') {
        return (
          <input type='hidden' name={input.name} value={value}/>
        )
      }

      return (
        <input type='hidden' name={input.name} value={input.value}/>
      )
    }

    return (
      <ReduxField {...rest} component={render}/>
    )
  }
}

import ComponentRegistry from '../../../api/ComponentRegistry'
ComponentRegistry.groupTo('Form', 'Hidden', FormControlHidden, 'packages/oneui/FormControlHidden')
export default FormControlHidden

