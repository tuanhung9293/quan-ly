'use strict'

import React, { Component } from 'react'
import PropsType from 'prop-types'
import { FormattedTime } from 'react-intl'
import ComponentRegistry from 'packages/api/ComponentRegistry'

class LogRow extends Component {
  static propTypes = {
    log: PropsType.object.isRequired
  }

  render () {
    const { log } = this.props

    return (
      <tr>
        <td className='width-100px'>
          <FormattedTime value={new Date(log.created_at)}/>
        </td>
        <td colSpan='2'>{log.text}</td>
      </tr>
    )
  }
}

ComponentRegistry.define('LogRow', function (log) {
  return (
    <LogRow key={log.id} log={log}/>
  )
}, '"packages/log"')

export default LogRow
