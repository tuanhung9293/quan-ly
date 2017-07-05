'use strict'

import React, { Component } from 'react'
import PropsType from 'prop-types'
import { FormattedTime } from 'react-intl'
import ComponentRegistry from 'packages/api/ComponentRegistry'

class DefaultFlashLog extends Component {
  static propTypes = {
    log: PropsType.object.isRequired
  }

  render () {
    const { log } = this.props

    return (
      <div>{log.text}</div>
    )
  }
}

ComponentRegistry.define('FlashLog', function (log) {
  return (
    <DefaultFlashLog key={log.id} log={log}/>
  )
}, '"packages/log"')

export default DefaultFlashLog
