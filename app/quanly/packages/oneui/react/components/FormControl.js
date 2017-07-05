'use strict'

import React, { PureComponent } from 'react'
import { FormControl as BootstrapFormControl } from 'react-bootstrap'

export default class FormControl extends PureComponent {
  static defaultProps = {
    type: 'text'
  }

  render () {
    const { placeholder, input, type } = this.props
    return (
      <BootstrapFormControl {...input}
                            type={type}
                            placeholder={placeholder}/>
    )
  }
}
