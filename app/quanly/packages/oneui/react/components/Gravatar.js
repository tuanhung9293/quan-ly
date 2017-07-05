'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import md5 from 'md5'

export default class Gravatar extends React.PureComponent {
  static propTypes = {
    email: PropTypes.string.isRequired
  }
  static defaultProps = {
    size: 0,
    alt: ''
  }

  render () {
    const { email, size, alt } = this.props
    var src = 'https://www.gravatar.com/avatar/' + md5(email)
    if (size > 0) {
      src += '?s=' + size
    }

    return (
      <img src={src} alt={alt}/>
    )
  }
}