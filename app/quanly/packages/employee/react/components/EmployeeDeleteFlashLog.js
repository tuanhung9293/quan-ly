'use strict'

import React, { Component } from 'react'
import { intlShape, injectIntl, defineMessages, FormattedHTMLMessage } from 'react-intl'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ComponentRegistry from 'packages/api/ComponentRegistry'
import * as Constants from '../../lib/constants'

const messages = defineMessages({
  restore: {
    id: 'FormAction.restore',
    defaultMessage: 'Restore'
  }
})

class EmployeeDeleteFlashLog extends Component {
  static propTypes = {
    intl: intlShape
  }

  render () {
    const formatMessage = this.props.intl.formatMessage
    const { log, actions } = this.props

    return (
      <div>
        <FormattedHTMLMessage id='EmployeeDeleteFlashLog.text'
                              defaultMessage='Employee <code>{email}</code> is deleted successfully'
                              values={{ email: log.metadata.email }}
        />

        <a href='javascript:void(0)'
           className='margin-left-10'
        >
          {formatMessage(messages.restore)}
        </a>
      </div>
    )
  }
}

const EmployeeDeleteFlashLogClass = injectIntl(
  connect(
    (state) => ({}),
    (dispatch) => ({ actions: bindActionCreators({}, dispatch) })
  )(EmployeeDeleteFlashLog)
)

ComponentRegistry.add('FlashLog', function (log) {
  if (log.item_type !== Constants.LOG_ITEM_TYPE || log.action !== Constants.LOG_ACTION_DELETE) {
    return false
  }
  return (
    <EmployeeDeleteFlashLogClass log={log}/>
  )
}, '"packages/employee"')

export default EmployeeDeleteFlashLogClass